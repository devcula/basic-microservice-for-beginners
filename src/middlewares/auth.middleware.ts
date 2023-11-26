import { Response, NextFunction } from 'express';
import { AuthPayload, CustomRequest } from '../interfaces/auth.interface';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const authorizeRequest = (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers?.authorization;
        if (!authHeader) {
            throw new Error("Authorization header is mandatory");
        }
        const token = authHeader.replace("Bearer ", "");
        const userData = jwt.verify(token, config.JWT_PASSPHRASE) as AuthPayload;

        if (typeof userData === "string" || !userData.username) {
            throw new Error();
        }

        // Appending user data to the request object to be used later
        // In an ideal world, we would be making a DB call here to get and set user data :)
        req.userDetails = userData;
        console.log(`Received authorized request from user : ${userData.username} for path : ${req.originalUrl}`);
        next();
    }
    catch (err) {
        console.log('Error in Auth Middleware', err.message)
        res.status(401).json({ error: "UnAuthorized" });
    }
}