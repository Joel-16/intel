import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { JwtPayload } from '../types/JwtPayload';
import { CustomError } from '../utils/response/custom-error/CustomError';

export const checkJwt = async(req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const customError = new CustomError(400, 'General', 'Authorization header not provided');
    return next(customError);
  }
  const token = authHeader.split(' ')[1];
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
    ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
    req.jwtPayload = jwtPayload as JwtPayload;
    let account = await prisma.user.findFirst({where :{id:req.jwtPayload.id}, select: {token: true} })
    if (account.token === token){
      return next();
    } else {
      const customError = new CustomError(401, 'Raw', 'Invalid Token, please sign in again');
      return next(customError);
    } 
  } catch (err) {
    const customError = new CustomError(401, 'Raw', 'Invalid token, please sign in again');
    return next(customError);
  }
};
