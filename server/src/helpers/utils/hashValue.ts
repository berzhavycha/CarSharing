import { HashResult } from "@/interfaces";
import * as bcrypt from 'bcrypt';

export const hashValue = async (value: string): Promise<HashResult> => {
    const salt = await bcrypt.genSalt();
    return { salt, hash: await bcrypt.hash(value, salt) };
}