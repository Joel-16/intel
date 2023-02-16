"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CustomError_1 = require("../utils/response/custom-error/CustomError");
const checkJwt = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const customError = new CustomError_1.CustomError(400, 'General', 'Authorization header not provided');
        return next(customError);
    }
    const token = authHeader.split(' ')[1];
    let jwtPayload;
    try {
        jwtPayload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
        req.jwtPayload = jwtPayload;
        let account = yield prisma.user.findFirst({ where: { id: req.jwtPayload.id }, select: { token: true } });
        if (account.token === token) {
            return next();
        }
        else {
            const customError = new CustomError_1.CustomError(401, 'Raw', 'Invalid Token, please sign in again');
            return next(customError);
        }
    }
    catch (err) {
        const customError = new CustomError_1.CustomError(401, 'Raw', 'Invalid token, please sign in again');
        return next(customError);
    }
});
exports.checkJwt = checkJwt;
//# sourceMappingURL=checkJwt.js.map