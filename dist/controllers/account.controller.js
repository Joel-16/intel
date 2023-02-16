"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const typedi_1 = require("typedi");
const CustomError_1 = require("../utils/response/custom-error/CustomError");
const account_service_1 = require("../services/account.service");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                let result = yield this.accountService.login(req.body, next);
                if (result) {
                    res.customSuccess(200, result);
                }
                else {
                    next(new CustomError_1.CustomError(400, 'General', 'Invalid credentials'));
                }
            }
            catch (_a) {
                next();
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.accountService.register(req.body, next));
            }
            catch (_b) {
                next();
            }
        });
        this.verifyEmail = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.accountService.verifyEmail(req.body.otp, next));
            }
            catch (_c) {
                next();
            }
        });
        this.forgotPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.accountService.forgotPassword(req.body.email, next));
            }
            catch (_d) {
                next();
            }
        });
        this.resetPassword = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.accountService.resetPassword(req.body, next));
            }
            catch (_e) {
                next();
            }
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.accountService.logout(req.jwtPayload.id, next));
            }
            catch (_f) {
                next();
            }
        });
    }
};
AccountController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map