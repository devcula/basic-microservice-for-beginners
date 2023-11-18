import { ERROR_LEVEL } from "../enums/errors.enum";
import { BaseError } from "./base.error";

export class ValidationError extends BaseError {
    constructor(message: string, level?: ERROR_LEVEL) {
        super(message || 'Validation error', level);
    }
}