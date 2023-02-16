import { Router } from 'express';
import Container from 'typedi';

import { AccountController } from '../controllers/account.controller';
import { checkJwt } from '../middleware/checkJwt';
import { validatorLogin, validatorRegister } from '../middleware/validation/auth';

const accountController = Container.get(AccountController);
const router = Router();

router.post('/login', validatorLogin, accountController.login);
router.post('/register', validatorRegister,accountController.register);
router.post('/verify-email', accountController.verifyEmail);
router.post('/forgot-password', accountController.forgotPassword);
router.post('/reset-password', accountController.resetPassword)
router.post('/logout', checkJwt, accountController.logout)

export default router;
