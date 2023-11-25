import { User, Role } from './mysql';

export const getUserDetails = async (username: string) => {
    const user = await User.findOne({ where: { username } });
}