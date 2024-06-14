import { User } from '@entities';

import { ITokens } from './tokens.interface';

export interface AuthResult {
  user: User;
  tokens: ITokens;
}
