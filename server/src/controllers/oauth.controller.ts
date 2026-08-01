import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { CurrentUser } from '@/decorators';
import { AuthorizeQueryDto, RegisterClientDto, TokenExchangeDto, VALID_SCOPES } from '@/dtos';
import { User } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import { Roles } from '@/helpers';
import {
  OAuthClientService,
  OAuthCodeService,
  OAuthTokenService,
  UsersService
} from '@/services';
import { OAuthAuthGuard } from '@/guards/oauth.guard';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthClientService: OAuthClientService,
    private readonly oauthCodeService: OAuthCodeService,
    private readonly oauthTokenService: OAuthTokenService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Step 1 — AI client redirects user here to grant consent.
   * User must already be logged in (cookie auth). If not, redirect to login.
   *
   * GET /oauth/authorize?clientId=...&redirectUri=...&codeChallenge=...&scope=...&state=...
   */
  @Get('authorize')
  @UseGuards(OAuthAuthGuard)
  async authorize(
    @Query() query: AuthorizeQueryDto,
    @CurrentUser() user: User,
    @Res() res: Response,
  ): Promise<void> {
    const { clientId, redirectUri, codeChallenge, codeChallengeMethod, scope, state } = query;

    // Validate client and redirect URI
    await this.oauthClientService.validateRedirectUri(clientId, redirectUri);
    const client = await this.oauthClientService.findByClientId(clientId);

    // Validate requested scopes against allowed list
    const requestedScopes = scope.split(' ').filter(Boolean);
    const invalidScopes = requestedScopes.filter(
      (s) => !VALID_SCOPES.includes(s as any),
    );
    if (invalidScopes.length) {
      throw new BadRequestException(
        `Invalid scopes requested: ${invalidScopes.join(', ')}`,
      );
    }

    // Issue authorization code
    const code = await this.oauthCodeService.issueCode({
      user,
      client,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      scopes: requestedScopes,
    });

    // Redirect back to MCP server with code + state
    const callbackUrl = new URL(redirectUri);
    callbackUrl.searchParams.set('code', code);
    callbackUrl.searchParams.set('state', state);

    res.redirect(callbackUrl.toString());
  }

  /**
   * Step 2 — MCP server exchanges authorization code for tokens.
   * Also handles refresh_token grant.
   *
   * POST /oauth/token
   */
  @Post('token')
  async token(@Body() body: TokenExchangeDto) {
    if (body.grantType === 'authorization_code') {
      return this.handleAuthorizationCodeGrant(body);
    }

    if (body.grantType === 'refresh_token') {
      return this.handleRefreshTokenGrant(body);
    }

    throw new BadRequestException('Unsupported grant type');
  }

  /**
   * Admin-only — register a new MCP client application.
   * Returns clientId + clientSecret (secret shown once, never again).
   *
   * POST /oauth/clients
   */
  @Post('clients')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async registerClient(@Body() body: RegisterClientDto) {
    return this.oauthClientService.registerClient(body.name, body.redirectUri);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  private async handleAuthorizationCodeGrant(body: TokenExchangeDto) {
    const { code, codeVerifier, redirectUri, clientId, clientSecret } = body;

    if (!code || !codeVerifier || !redirectUri || !clientId || !clientSecret) {
      throw new BadRequestException(
        'Missing required fields for authorization_code grant',
      );
    }

    // Validate client credentials
    await this.oauthClientService.validateClient(clientId, clientSecret);

    // Consume the code (validates PKCE, expiry, single-use)
    const oauthCode = await this.oauthCodeService.consumeCode(
      code,
      codeVerifier,
      redirectUri,
    );

    const scopes = oauthCode.scopes.split(' ');

    return this.oauthTokenService.issueTokenPair(oauthCode.user, scopes);
  }

  private async handleRefreshTokenGrant(body: TokenExchangeDto) {
    const { refreshToken } = body;

    if (!refreshToken) {
      throw new BadRequestException(
        'Missing refresh_token for refresh_token grant',
      );
    }

    const payload = this.oauthTokenService.verifyRefreshToken(refreshToken);
    const user = await this.usersService.findById(payload.sub);

    return this.oauthTokenService.issueTokenPair(user, payload.scopes);
  }
}