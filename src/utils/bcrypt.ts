import bcrypt from 'bcrypt';
import { BcryptConfig } from '../config';

export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = BcryptConfig.saltRounds;
    return await bcrypt.hash(password, saltRounds);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}