"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.AccountService = void 0;
const bcrypt_1 = require("bcrypt");
const typedi_1 = require("typedi");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const notifications_1 = __importDefault(require("../utils/notifications"));
const createJwtToken_1 = require("../utils/createJwtToken");
const CustomError_1 = require("../utils/response/custom-error/CustomError");
let AccountService = class AccountService {
    login(payload, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield prisma.user.findUnique({
                    where: {
                        email: payload.email,
                    },
                    select: {
                        password: true,
                        id: true,
                        email_verified: true,
                        name: true,
                    },
                });
                if (!account || !(0, bcrypt_1.compareSync)(payload.password, account.password)) {
                    return null;
                }
                else if (!account.email_verified) {
                    let otp = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
                    yield prisma.user.update({
                        where: {
                            id: account.id,
                        },
                        data: {
                            otp,
                        },
                    });
                    notifications_1.default.emit('registration', payload.email, account.name, otp);
                    setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                        yield prisma.user.update({
                            where: {
                                id: account.id,
                            },
                            data: {
                                otp: null,
                            },
                        });
                    }), 300000);
                    return { message: "It seems you haven't verified your email address yet. A mail has been sent to you to verify your email address" };
                }
                else {
                    const token = (0, createJwtToken_1.createJwtToken)({ id: account.id, verified: account.email_verified });
                    yield prisma.user.update({
                        where: {
                            email: payload.email
                        }, data: {
                            token
                        }
                    });
                    return {
                        token
                    };
                }
            }
            catch (err) {
                console.log(err);
                return next(new CustomError_1.CustomError(500, 'Raw', `Internal server error`, err));
            }
        });
    }
    register(payload, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let stat = yield prisma.user.findUnique({
                    where: {
                        email: payload.email,
                    },
                });
                if (stat) {
                    return next(new CustomError_1.CustomError(401, 'General', 'Email already associated with an account'));
                }
                let otp = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
                const account = yield prisma.user.create({
                    data: {
                        email: payload.email,
                        password: (0, bcrypt_1.hashSync)(payload.password, 10),
                        name: payload.name,
                        otp,
                    },
                });
                notifications_1.default.emit('registration', payload.email, account.name, otp);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield prisma.user.update({
                        where: {
                            id: account.id,
                        },
                        data: {
                            otp: null,
                        },
                    });
                }), 300000);
                return {
                    message: 'Check your mail to veriy your email address',
                };
            }
            catch (err) {
                console.log(err);
                return next(new CustomError_1.CustomError(500, 'Raw', `Internal server error`, err));
            }
        });
    }
    verifyEmail(otp, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield prisma.user.findFirst({
                    where: {
                        otp,
                    },
                    select: {
                        id: true,
                    },
                });
                if (!account) {
                    return next(new CustomError_1.CustomError(404, 'General', 'Invalid token or token has expired'));
                }
                yield prisma.user.update({
                    where: {
                        id: account.id,
                    },
                    data: {
                        email_verified: true,
                        otp: null,
                    },
                });
                return { status: 'success' };
            }
            catch (error) {
                console.log(error);
                return next(new CustomError_1.CustomError(500, 'Raw', 'Internal server error'));
            }
        });
    }
    forgotPassword(email, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield prisma.user.findUnique({
                    where: {
                        email,
                    },
                });
                if (!account) {
                    return next(new CustomError_1.CustomError(401, 'General', "Account doesn't exist with this email address"));
                }
                if (!account.email_verified) {
                    return next(new CustomError_1.CustomError(401, 'General', "Your email hasn't been verified yet, attempt to signup so that a verification mail can be sent to you to enable you verify your account"));
                }
                let otp = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
                yield prisma.user.update({
                    where: {
                        id: account.id,
                    },
                    data: {
                        otp,
                    },
                });
                console.log(otp);
                notifications_1.default.emit('forgotPassword', email, otp);
                setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    yield prisma.user.update({
                        where: {
                            id: account.id,
                        },
                        data: {
                            otp: null,
                        },
                    });
                }), 900000);
                return { message: 'Please input the code sent to your mail' };
            }
            catch (error) {
                console.log(error);
                return next(new CustomError_1.CustomError(500, 'Raw', 'Internal server error'));
            }
        });
    }
    resetPassword(payload, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const account = yield prisma.user.findFirst({
                    where: {
                        otp: payload.otp,
                    },
                    select: {
                        password: true,
                        id: true,
                    },
                });
                if (!account) {
                    return next(new CustomError_1.CustomError(404, 'General', 'Invalid token or token has expired'));
                }
                yield prisma.user.update({
                    where: {
                        id: account.id,
                    },
                    data: {
                        password: (0, bcrypt_1.hashSync)(payload.password, 10),
                        otp: null,
                    },
                });
                return { message: 'success' };
            }
            catch (error) {
                console.log(error);
                return next(new CustomError_1.CustomError(500, 'Raw', 'Internal server error'));
            }
        });
    }
    logout(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            yield prisma.user.update({
                where: {
                    id,
                },
                data: {
                    token: null
                },
            });
            return { message: 'successfully logged out' };
        });
    }
};
AccountService = __decorate([
    (0, typedi_1.Service)()
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map