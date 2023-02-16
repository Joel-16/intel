"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(httpStatusCode, errorType, message, errorsValidation = null) {
        super(message);
        this.name = this.constructor.name;
        this.httpStatusCode = httpStatusCode;
        this.errorType = errorType;
        this.errorsValidation = errorsValidation;
    }
    get HttpStatusCode() {
        return this.httpStatusCode;
    }
    get JSON() {
        return {
            errorType: this.errorType,
            errorMessage: this.message,
            errorsValidation: this.errorsValidation,
        };
    }
}
exports.CustomError = CustomError;
//# sourceMappingURL=CustomError.js.map