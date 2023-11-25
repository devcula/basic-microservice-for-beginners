import { Request } from "express";
import { ROLES } from "../enums/users.enum";

export interface TokenPayload {
    username: string;
}

export interface CustomRequest extends Request {
    username?: string;
    userType?: ROLES;
}