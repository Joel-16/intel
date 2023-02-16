import { compareSync, hashSync } from 'bcrypt';
import { NextFunction } from 'express';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import emailNotification from '../utils/notifications';
import { createJwtToken } from '../utils/createJwtToken';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
export class AccountService {
  async login(payload: { email: string; password: string }, next: NextFunction) {
    try {
      const account = await prisma.user.findUnique({
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
      if (!account || !compareSync(payload.password, account.password)) {
        return null;
      } else if (!account.email_verified) {
        let otp = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
        await prisma.user.update({
          where: {
            id: account.id,
          },
          data: {
            otp,
          },
        });
        emailNotification.emit('registration', payload.email, account.name, otp);
        setTimeout(async () => {
          await prisma.user.update({
            where: {
              id: account.id,
            },
            data: {
              otp: null,
            },
          });
        }, 300000);
        return { message: "It seems you haven't verified your email address yet. A mail has been sent to you to verify your email address" };
      } else {
        const token = createJwtToken({ id: account.id, verified: account.email_verified })
        await prisma.user.update({
          where:{
            email : payload.email
          }, data: {
            token
          }
        })
        return {
          token
        };
      }
    } catch (err) {
      console.log(err);
      return next(new CustomError(500, 'Raw', `Internal server error`, err));
    }
  }
  async register(payload, next: NextFunction) {
    try {
      let stat = await prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
      if (stat) {
        return next(new CustomError(401, 'General', 'Email already associated with an account'));
      }
      let otp = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
      const account = await prisma.user.create({
        data: {
          email: payload.email,
          password: hashSync(payload.password, 10),
          name: payload.name,
          otp,
        },
      });
      emailNotification.emit('registration', payload.email, account.name, otp);
      setTimeout(async () => {
        await prisma.user.update({
          where: {
            id: account.id,
          },
          data: {
            otp: null,
          },
        });
      }, 300000);
      return {
        message: 'Check your mail to veriy your email address',
      };
    } catch (err) {
      console.log(err);
      return next(new CustomError(500, 'Raw', `Internal server error`, err));
    }
  }

  async verifyEmail(otp, next: NextFunction) {
    try {
      const account = await prisma.user.findFirst({
        where: {
          otp,
        },
        select: {
          id: true,
        },
      });
      if (!account) {
        return next(new CustomError(404, 'General', 'Invalid token or token has expired'));
      }
      await prisma.user.update({
        where: {
          id: account.id,
        },
        data: {
          email_verified: true,
          otp: null,
        },
      });
      return { status: 'success' };
    } catch (error) {
      console.log(error);
      return next(new CustomError(500, 'Raw', 'Internal server error'));
    }
  }

  async forgotPassword(email: string, next: NextFunction) {
    try {
      let account = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!account) {
        return next(new CustomError(401, 'General', "Account doesn't exist with this email address"));
      }
      if(!account.email_verified){
        return next(new CustomError(401, 'General', "Your email hasn't been verified yet, attempt to signup so that a verification mail can be sent to you to enable you verify your account"));
      }
      let otp = String(Math.floor(Math.pow(10, 5) + Math.random() * (Math.pow(10, 6) - Math.pow(10, 5) - 1)));
      await prisma.user.update({
        where: {
          id: account.id,
        },
        data: {
          otp,
        },
      });
      emailNotification.emit('forgotPassword', email, otp);
      setTimeout(async () => {
        await prisma.user.update({
          where: {
            id: account.id,
          },
          data: {
            otp: null,
          },
        });
      }, 900000);
      return { message: 'A code has been sent to your mail, use it to reset your password' };
    } catch (error) {
      console.log(error);
      return next(new CustomError(500, 'Raw', 'Internal server error'));
    }
  }

  async resetPassword(payload: { otp: string; password: string }, next: NextFunction) {
    try {
      const account = await prisma.user.findFirst({
        where: {
          otp: payload.otp,
        },
        select: {
          id: true,
        },
      });
      if (!account) {
        return next(new CustomError(404, 'General', 'Invalid token or token has expired'));
      }
      await prisma.user.update({
        where: {
          id: account.id,
        },
        data: {
          password: hashSync(payload.password, 10),
          otp: null,
        },
      });
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      return next(new CustomError(500, 'Raw', 'Internal server error'));
    }
  }

  async logout(id: number,next: NextFunction){
    await prisma.user.update({
      where: {
        id,
      },
      data: {
       token: null
      },
    });
    return { message: 'successfully logged out' };
  }
}
