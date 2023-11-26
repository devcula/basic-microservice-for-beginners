import { Request } from "express";
import { ROLES } from "../enums/users.enum";

export interface AuthPayload {
    userId: number;
    username: string;
    userRole: ROLES;
}

export interface CustomRequest extends Request {
    userDetails: AuthPayload;
}