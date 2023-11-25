import { ROLES } from '../enums/users.enum';
import { UserCreationAttributes } from '../interfaces/models.interface';
import { User, Role } from './mysql';
import crypto from 'crypto';

export const getUserDetails = async (username: string): Promise<User> => {
    const user = await User.findOne({
        where: { username },
        attributes: ['username', 'role'],
    });

    return user;    // { username: 'tutor1', role: 'tutor' }
}

export const createUser = async (username: string, password: string, role: ROLES) => {
    /**
     * Hash password before saving it. Even though it's a test service, better to follow some standards :P
     */
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const user: UserCreationAttributes = {
        username,
        password: hashedPassword,
        role
    }

    const createdUser = await User.create(user);
    return createdUser;
}