import { NextFunction } from 'express';
import { Service } from 'typedi';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
export default class TweetService {
 

  async createTweet(id: number, content: string, next: NextFunction) {
    try {
      let tweet = await prisma.tweet.create({
        data:{
          content
        }
      })
      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          tweets: {
            connect: {
              id: tweet.id
            }
          }
        },
      });
      return tweet
    } catch (err) {
      return next(new CustomError(400, 'Raw', 'Error'));
    }
  }
  async getTweets(next: NextFunction) {
    try {
      return await prisma.tweet.findMany({include: {
        comments: true
      }})
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error'));
    }
  }

  
  async likeTweet(id: number, next: NextFunction) {
    try {
      let likes = await prisma.tweet.findUnique({
        where: {
          id
        }, select:{
          likes: true
        }
      })
      let tweet =await prisma.tweet.update({
        where: {
          id
        }, data:{
          likes: likes.likes + 1
        }
      })
      return tweet
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error'));
    }
  }
  async comment(jwt: number, payload : {tweetId: number, content}, next: NextFunction) {
    try {
      let comment = await prisma.comments.create({
        data:{
          content: payload.content
        }
      })
      await prisma.user.update({
        where: {
          id: jwt,
        },
        data: {
          comments: {
            connect: {
              id: comment.id
            }
          }
        }
      });
      let tweet = await prisma.tweet.update({
        where:{
          id: payload.tweetId
        }, data:{
          comments:{
            connect:{
              id: comment.id
            }
          }
        }, include: {
          comments: true
        }
      })
      return tweet
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error'));
    }
  }

  async deleteTweet(tweetId: number, next: NextFunction) {
    try {
      await prisma.tweet.delete({
        where: {
          id: tweetId
        }
      })
    } catch (error) {
      return next(new CustomError(400, 'Raw', 'Error'));
    }
  }


}
