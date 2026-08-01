// server/src/oauth/guards/oauth-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response, Request } from 'express';

@Injectable()
export class OAuthAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, _info: any, context: ExecutionContext) {
    if (err || !user) {
      const res: Response = context.switchToHttp().getResponse();
      const req: Request = context.switchToHttp().getRequest();
      // Preserve the full /oauth/authorize URL to return to after login
      const returnTo = encodeURIComponent(req.originalUrl);
      // Redirect to your React/Vue frontend login page
      res.redirect(`${process.env.FRONTEND_URL}/sign-in?returnTo=${returnTo}`);
      return null;
    }
    return user;
  }
}