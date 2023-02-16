import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';
import { CustomError } from '../utils/response/custom-error/CustomError';

import { AccountService } from '../services/account.service';

@Service()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      let result = await this.accountService.login(req.body, next)
      if (result){
        res.customSuccess(200, result);
      } else {
        next(new CustomError(400, 'General', 'Invalid credentials'))
      }
    } catch {
      next();
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.accountService.register(req.body, next));
    } catch {
      next();
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.accountService.verifyEmail(req.body.otp, next));
    } catch {
      next();
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.accountService.forgotPassword(req.body.email,next));
    } catch {
      next();
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.accountService.resetPassword(req.body, next));
    } catch {
      next();
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.accountService.logout(req.jwtPayload.id, next));
    } catch {
      next();
    }
  };
}
