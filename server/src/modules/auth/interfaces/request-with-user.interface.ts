import { Request } from 'express-serve-static-core';

import { User } from '@modules/users';

export interface RequestWithUser extends Request {
  user: User;
}
