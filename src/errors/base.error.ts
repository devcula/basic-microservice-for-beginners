import { ERROR_LEVEL } from "../enums/errors.enum";

export class BaseError extends Error {
    private _level: ERROR_LEVEL;

    constructor(message: string, level = ERROR_LEVEL.HIGH) {
        super(message);
        this.name = this.constructor.name;
        this._level = level;
    }

    public get level() {
        return this._level;
    }
}