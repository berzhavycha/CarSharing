import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';

import { Roles } from '@shared';

import { RequestWithUser } from '../interfaces';

import { JwtAuthGuard } from './jwt-auth.guard';

export const RoleGuard = (role: Roles): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
      await super.canActivate(context);

      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user?.role.name === role;
    }
  }

  return mixin(RoleGuardMixin);
};
