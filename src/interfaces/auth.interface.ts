import { Request } from "express";
import { USER_TYPE } from "../enums/users.enum";

export interface TokenPayload {
    username: string;
}

export interface CustomRequest extends Request {
    username?: string;
    userType?: USER_TYPE;
}