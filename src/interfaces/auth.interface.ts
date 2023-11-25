import { Request } from "express";
import { ROLES } from "../enums/users.enum";

export interface AuthPayload {
    username: string;
    userRole: ROLES;
}

export interface CustomRequest extends Request {
    userDetails: AuthPayload;
}