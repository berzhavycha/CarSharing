import { User } from '@entities';
import { Request } from 'express-serve-static-core';

export interface RequestWithUser extends Request {
  user: User;
}
