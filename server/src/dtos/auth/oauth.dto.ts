import {
  IsIn,
  IsString,
  IsUrl,
} from 'class-validator';

export const VALID_SCOPES = [
  'cars:read',
  'rentals:read',
  'rentals:write',
  'profile:read',
] as const;

export type OAuthScope = (typeof VALID_SCOPES)[number];

export class AuthorizeQueryDto {
  @IsString()
  clientId: string;

  @IsUrl({ require_tld: false })
  redirectUri: string;

  @IsString()
  codeChallenge: string;

  @IsIn(['S256'])
  codeChallengeMethod: string;

  @IsString()
  scope: string; // space-separated e.g. "cars:read rentals:read"

  @IsString()
  state: string; // opaque value, echoed back to client for CSRF protection
}

export class TokenExchangeDto {
  @IsIn(['authorization_code', 'refresh_token'])
  grantType: string;

  // Required for authorization_code grant
  code?: string;
  codeVerifier?: string;
  redirectUri?: string;
  clientId?: string;
  clientSecret?: string;

  // Required for refresh_token grant
  refreshToken?: string;
}

export class RegisterClientDto {
  @IsString()
  name: string;

  @IsUrl({ require_tld: false })
  redirectUri: string;
}