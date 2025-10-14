import {
  CanActivate,
  ExecutionContext,
  Inject,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { extractJWTFromCookies } from 'apps/identity/src/helpers';
import { catchError, map, Observable, tap } from 'rxjs';

import { AUTH_SERVICE } from '../helpers';
import { Roles } from '../helpers/constants/auth';

export const RoleGuard = (roles: Roles[]): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    constructor(
      @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
    ) {}

    canActivate(
      context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
      const req = context.switchToHttp().getRequest();

      let jwt: string | undefined = extractJWTFromCookies(req, 'accessToken');
      if (!jwt) {
        const authHeader =
          req.headers['authorization'] || req.headers['Authorization'];
        if (
          typeof authHeader === 'string' &&
          authHeader.startsWith('Bearer ')
        ) {
          jwt = authHeader.substring(7);
        }
      }

      if (!jwt) {
        throw new UnauthorizedException('No access token provided');
      }

      return this.authClient.send('authenticate', { accessToken: jwt }).pipe(
        tap((res) => {
          if (roles?.length) {
            const hasRole = roles.some((role) => res.role.name === role);
            if (!hasRole) {
              throw new UnauthorizedException('User does not have valid roles');
            }
          }
          req.user = res;
        }),
        map(() => true),
        catchError((err) => {
          console.error('[RoleGuard] Auth error:', err);
          throw err;
        }),
      );
    }
  }
  return mixin(RoleGuardMixin);
};
