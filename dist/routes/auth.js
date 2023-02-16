"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const account_controller_1 = require("../controllers/account.controller");
const checkJwt_1 = require("../middleware/checkJwt");
const auth_1 = require("../middleware/validation/auth");
const accountController = typedi_1.default.get(account_controller_1.AccountController);
const router = (0, express_1.Router)();
router.post('/login', auth_1.validatorLogin, accountController.login);
router.post('/register', auth_1.validatorRegister, accountController.register);
router.post('/verify-email', accountController.verifyEmail);
router.post('/forgot-password', accountController.forgotPassword);
router.post('/reset-password', accountController.resetPassword);
router.post('/logout', checkJwt_1.checkJwt, accountController.logout);
exports.default = router;
//# sourceMappingURL=auth.js.map