import jwt from 'jsonwebtoken';
import config from '../../config';
import { TokenPayload } from '../interfaces/auth.interface';

export const login = (username: string, password: string): { token: string } => {
    const payload: TokenPayload = {
        username
    };
    console.log(`Generating auth for user : ${username}`);
    const authToken = jwt.sign(payload, config.JWT_PASSPHRASE);  // Uses HS256 by default which is fine for this use case
    return {
        token: authToken
    }
}