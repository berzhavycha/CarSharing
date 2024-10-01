import { Instance, t } from 'mobx-state-tree';

import { Roles } from '@/helpers';
import { PublicFile } from '@/types';

export const UserModel = t.model('UserModel', {
  id: t.string,
  email: t.string,
  firstName: t.string,
  lastName: t.string,
  isEmailConfirmed: t.boolean,
  balance: t.maybeNull(t.number),
  role: t.enumeration('Roles', [Roles.ADMIN, Roles.USER]),
  avatar: t.maybeNull(t.frozen<PublicFile>()),
  avatarId: t.maybeNull(t.string),
});

export interface UserType extends Instance<typeof UserModel> {}
