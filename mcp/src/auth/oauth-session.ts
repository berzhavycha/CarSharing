import axios from 'axios';
import * as crypto from 'crypto';

const API_BASE_URL = process.env.API_BASE_URL ?? 'http://localhost:4000';
const MCP_CLIENT_ID = process.env.MCP_CLIENT_ID!;
const MCP_CLIENT_SECRET = process.env.MCP_CLIENT_SECRET!;
const MCP_REDIRECT_URI = process.env.MCP_REDIRECT_URI!;

export const SCOPES = [
  'cars:read',
  'rentals:read',
  'rentals:write',
  'profile:read',
];

export interface TokenSet {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // unix ms
  scopes: string[];
}

// In-memory token store keyed by sessionId
// In production, replace with Redis or encrypted DB store
const tokenStore = new Map<string, TokenSet>();

// In-flight PKCE state keyed by state param
const pkceStore = new Map<string, { codeVerifier: string; sessionId: string }>();

// ─── PKCE helpers ────────────────────────────────────────────────────────────

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return crypto.createHash('sha256').update(verifier).digest('base64url');
}

function generateState(): string {
  return crypto.randomBytes(16).toString('hex');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Build the authorization URL to redirect the user to.
 * Returns the URL and a state value to track the session.
 */
export function buildAuthorizationUrl(sessionId: string): string {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  pkceStore.set(state, { codeVerifier, sessionId });

  // Clean up stale PKCE entries after 5 minutes
  setTimeout(() => pkceStore.delete(state), 5 * 60 * 1000);

  const url = new URL(`${API_BASE_URL}/oauth/authorize`);
  url.searchParams.set('clientId', MCP_CLIENT_ID);
  url.searchParams.set('redirectUri', MCP_REDIRECT_URI);
  url.searchParams.set('codeChallenge', codeChallenge);
  url.searchParams.set('codeChallengeMethod', 'S256');
  url.searchParams.set('scope', SCOPES.join(' '));
  url.searchParams.set('state', state);

  return url.toString();
}

/**
 * Exchange authorization code for tokens after user grants consent.
 * Called by the OAuth callback endpoint in main.ts.
 */
export async function exchangeCodeForTokens(
  code: string,
  state: string,
): Promise<string> {
  const pkceEntry = pkceStore.get(state);
  if (!pkceEntry) {
    throw new Error('Invalid or expired OAuth state');
  }

  pkceStore.delete(state);

  const { codeVerifier, sessionId } = pkceEntry;

  const response = await axios.post(`${API_BASE_URL}/oauth/token`, {
    grantType: 'authorization_code',
    code,
    codeVerifier,
    redirectUri: MCP_REDIRECT_URI,
    clientId: MCP_CLIENT_ID,
    clientSecret: MCP_CLIENT_SECRET,
  });

  const { accessToken, refreshToken, expiresIn, scope } = response.data;

  tokenStore.set(sessionId, {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    scopes: scope.split(' '),
  });

  return sessionId;
}

/**
 * Get a valid access token for a session, refreshing if needed.
 */
export async function getAccessToken(sessionId: string): Promise<string> {
  const tokens = tokenStore.get(sessionId);
  if (!tokens) {
    throw new Error('No tokens found for session — user must re-authorize');
  }

  // Refresh 60 seconds before expiry
  if (Date.now() >= tokens.expiresAt - 60_000) {
    return refreshAccessToken(sessionId, tokens);
  }

  return tokens.accessToken;
}

async function refreshAccessToken(
  sessionId: string,
  tokens: TokenSet,
): Promise<string> {
  const response = await axios.post(`${API_BASE_URL}/oauth/token`, {
    grantType: 'refresh_token',
    refreshToken: tokens.refreshToken,
  });

  const { accessToken, refreshToken, expiresIn, scope } = response.data;

  const updated: TokenSet = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
    scopes: scope.split(' '),
  };

  tokenStore.set(sessionId, updated);

  return updated.accessToken;
}

export function clearSession(sessionId: string): void {
  tokenStore.delete(sessionId);
}