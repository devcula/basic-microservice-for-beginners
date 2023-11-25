import { Response, NextFunction } from 'express';
import { CustomRequest } from '../interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';
import { ROLES } from '../enums/users.enum';

export const authorizeRequest = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            throw new Error("Authorization header is mandatory");
        }
        const token = authHeader.replace("Bearer ", "");
        const userData = jwt.verify(token, config.JWT_PASSPHRASE);

        if (typeof userData === "string" || !userData.username) {
            throw new Error();
        }

        const username: string = userData.username;

        // Since we are not using any database here for authentication, having the below restriction will help distinguishing
        const userType: ROLES = username.startsWith("tutor") ? ROLES.TUTOR : ROLES.STUDENT;

        // Appending user data to the request object to be used later
        // In an ideal world, we would be making a DB call here to get and set user data :)
        req.username = username;
        req.userType = userType;
        console.log(`Received authorized request from user : ${username} for path : ${req.originalUrl}`);
        next();
    }
    catch (err) {
        res.status(401).json({ error: err.message || "UnAuthorized" });
    }
}