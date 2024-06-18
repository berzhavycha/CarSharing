import { Request } from 'express-serve-static-core';

import { User } from '@/entities';

export interface RequestWithUser extends Request {
  user: User;
}
