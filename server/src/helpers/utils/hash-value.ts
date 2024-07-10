import * as bcrypt from 'bcryptjs';

import { HashResult } from '@/interfaces';

export const hashValue = async (value: string): Promise<HashResult> => {
  const salt = await bcrypt.genSalt();
  return { salt, hash: await bcrypt.hash(value, salt) };
};
