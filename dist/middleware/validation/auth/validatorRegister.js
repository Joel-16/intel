"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorRegister = void 0;
const validator_1 = __importDefault(require("validator"));
const CustomError_1 = require("../../../utils/response/custom-error/CustomError");
const validatorRegister = (req, res, next) => {
    let { email, password, name } = req.body;
    const errorsValidation = [];
    email = !email ? '' : email;
    password = !password ? '' : password;
    if (!validator_1.default.isEmail(email)) {
        errorsValidation.push({ email: 'Email is invalid' });
    }
    if (validator_1.default.isEmpty(email)) {
        errorsValidation.push({ email: 'Email is required' });
    }
    if (validator_1.default.isEmpty(password)) {
        errorsValidation.push({ password: 'Password is required' });
    }
    if (typeof name != 'string' || validator_1.default.isEmpty(name)) {
        errorsValidation.push({ name: 'name is required' });
    }
    if (errorsValidation.length !== 0) {
        const customError = new CustomError_1.CustomError(400, 'Validation', 'Register validation error', errorsValidation);
        return next(customError);
    }
    return next();
};
exports.validatorRegister = validatorRegister;
//# sourceMappingURL=validatorRegister.js.map