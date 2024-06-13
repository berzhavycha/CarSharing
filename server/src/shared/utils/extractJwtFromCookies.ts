import { Request } from 'express-serve-static-core';

export function extractJWTFromCookies(
  req: Request,
  tokenName: string,
): string | null {
  if (req.cookies && req.cookies.tokens) {
    return req.cookies.tokens[tokenName];
  }
  return null;
}
