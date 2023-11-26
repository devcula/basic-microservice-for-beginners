import jwt from 'jsonwebtoken';
import config from '../../config';
import { AuthPayload } from '../interfaces/auth.interface';
import * as UserModel from '../models/user.model';
import { UserAttributes } from '../interfaces/models.interface';
import { ROLES } from '../enums/users.enum';

export const login = async (username: string, password: string): Promise<{ token: string }> => {
    console.log(`Generating auth for user : ${username}`);

    const dbUsername = username.toLowerCase();    // Our system will be having case insensitive username coz why not?
    let user = await UserModel.getUserDetails(dbUsername);
    let userDetails: UserAttributes;

    if (user) {
        // Here, We should have hashed the received password to SHA256 here and matched with the db password
        // However for test purposes, we are not doing that
        // Best way would be to create a authenticate fn in User model,
        // Then authenticate the user by matching username and hashed pwd in DB only without even fetching the password
        userDetails = user.toJSON();
    }
    else {
        // Create new user
        // Ideally we should be getting the role from UI during sign-up but having some random logic here
        // If the username starts with tutor, the role will be tutor.. Otherwise, student.
        const role = dbUsername.startsWith(ROLES.TUTOR) ? ROLES.TUTOR : ROLES.STUDENT;
        const createdUser = await UserModel.createUser(dbUsername, password, role);
        userDetails = createdUser.toJSON();
    }

    console.log(`User details`, userDetails);

    const payload: AuthPayload = {
        username: userDetails.username,
        userRole: userDetails.role,
        userId: userDetails.id
    };

    const authToken = jwt.sign(payload, config.JWT_PASSPHRASE, { expiresIn: '1h' });  // Uses HS256 by default which is fine here
    return {
        token: authToken
    }
}