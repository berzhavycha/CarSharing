import { User } from '@modules/users';
import { ITokens } from './tokens.interface';

export interface AuthResult {
  user: User
  tokens: ITokens;
}
