import jwt from 'jsonwebtoken';

export const login = async (username: string, password: string): Promise<any> => {
    const payload = {
        user: username
    };
    console.log(`Generating auth for user : ${username}`);
    const authToken = jwt.sign(payload, process.env.JWT_PASSPHRASE);  // Uses HS256 by default which is fine for this use case
    return {
        token: authToken
    }
}