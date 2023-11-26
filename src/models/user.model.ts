import { Op } from 'sequelize';
import { ROLES } from '../enums/users.enum';
import { UserCreationAttributes } from '../interfaces/models.interface';
import { User } from './mysql';
import crypto from 'crypto';

export const getUserDetails = async (username: string): Promise<User> => {
    const user = await User.findOne({
        where: { username },
        attributes: ['username', 'role', 'id'],
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

export const getMultipleUserDetails = async (usernames: string[]): Promise<User[]> => {
    const users: User[] = await User.findAll({
        where: {
            username: {
                [Op.in]: usernames
            }
        },
        attributes: ['username', 'role', 'id'],
    });

    return users;
}