import { Response, NextFunction } from "express";
import { CustomRequest } from "../interfaces/auth.interface";
import { ROLES } from "../enums/users.enum";

export const authorizeTutor = (req: CustomRequest, res: Response, next: NextFunction) => {
    // Verify if the current request comes from a tutor
    // Used in routes which can only be accessed by a tutor
    const isTutor = req.userDetails?.userRole === ROLES.TUTOR;
    if (isTutor) {
        next();
    }
    else {
        res.status(401).json({ error: "UnAuthorized" });
    }
}