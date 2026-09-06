import { createHash } from 'crypto';

export const hashPayload = (payload: object): string => {
  return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
};