import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';

import { OauthCode, User, OauthClient } from '@/entities';

const CODE_BYTES = 32;
const CODE_TTL_SECONDS = 60; // authorization codes expire in 60 seconds

@Injectable()
export class OAuthCodeService {
  constructor(
    @InjectRepository(OauthCode)
    private readonly codeRepository: Repository<OauthCode>,
  ) {}

  async issueCode(options: {
    user: User;
    client: OauthClient;
    redirectUri: string;
    codeChallenge: string;
    codeChallengeMethod: string;
    scopes: string[];
  }): Promise<string> {
    const rawCode = crypto.randomBytes(CODE_BYTES).toString('hex');

    // Store SHA-256 hash — raw code travels over redirect, never stored plain
    const codeHash = crypto
      .createHash('sha256')
      .update(rawCode)
      .digest('hex');

    const expiresAt = new Date(Date.now() + CODE_TTL_SECONDS * 1000);

    const code = this.codeRepository.create({
      codeHash,
      redirectUri: options.redirectUri,
      codeChallenge: options.codeChallenge,
      codeChallengeMethod: options.codeChallengeMethod,
      scopes: options.scopes.join(' '),
      expiresAt,
      user: options.user,
      client: options.client,
    });

    await this.codeRepository.save(code);

    return rawCode;
  }

  async consumeCode(
    rawCode: string,
    codeVerifier: string,
    redirectUri: string,
  ): Promise<OauthCode> {
    const codeHash = crypto
      .createHash('sha256')
      .update(rawCode)
      .digest('hex');

    const code = await this.codeRepository.findOne({
      where: { codeHash },
      relations: ['user', 'user.role', 'client'],
    });

    if (!code) {
      throw new UnauthorizedException('Invalid authorization code');
    }

    if (code.isUsed) {
      throw new UnauthorizedException('Authorization code already used');
    }

    if (new Date() > code.expiresAt) {
      throw new UnauthorizedException('Authorization code expired');
    }

    if (code.redirectUri !== redirectUri) {
      throw new UnauthorizedException('Redirect URI mismatch');
    }

    // Verify PKCE code_verifier against stored code_challenge
    this.verifyPkce(codeVerifier, code.codeChallenge, code.codeChallengeMethod);

    // Mark as used — codes are single-use
    code.isUsed = true;
    await this.codeRepository.save(code);

    return code;
  }

  private verifyPkce(
    codeVerifier: string,
    codeChallenge: string,
    method: string,
  ): void {
    if (method !== 'S256') {
      throw new UnauthorizedException(
        'Only S256 code challenge method is supported',
      );
    }

    const expectedChallenge = crypto
      .createHash('sha256')
      .update(codeVerifier)
      .digest('base64url');

    if (expectedChallenge !== codeChallenge) {
      throw new UnauthorizedException('PKCE verification failed');
    }
  }
}