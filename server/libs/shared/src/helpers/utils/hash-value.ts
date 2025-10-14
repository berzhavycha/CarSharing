import * as bcrypt from 'bcryptjs';

export interface HashResult {
  salt: string;
  hash: string;
}

export const hashValue = async (value: string): Promise<HashResult> => {
  const salt = await bcrypt.genSalt();
  return { salt, hash: await bcrypt.hash(value, salt) };
};
