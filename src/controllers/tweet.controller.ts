import { Response, Request, NextFunction } from 'express';
import { Service } from 'typedi';
import { CustomError } from '../utils/response/custom-error/CustomError';

import TweetService from '../services/tweet.service';

@Service()
class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  createTweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (typeof req.body.content != 'string' || req.body.content.length === 0) {
        next(new CustomError(400, 'Validation', "content is required"))
      }
      res.customSuccess(200, await this.tweetService.createTweet(req.jwtPayload.id,req.body.content, next));
    } catch {
      next();
    }
  };

  getTweets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.customSuccess(200, await this.tweetService.getTweets(next));
    } catch {
      next();
    }
  };

  likeTweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isNaN(Number(req.params.id))) {
        next(new CustomError(400, 'Validation', "id of tweet is required"))
      }
      res.customSuccess(200, await this.tweetService.likeTweet(Number(req.params.id), next));
    } catch {
      next();
    }
  };

  comment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (typeof req.body.content != 'string' || req.body.content.length === 0) {
        next(new CustomError(400, 'Validation', "content is required"))
      }
      if (isNaN(Number(req.body.tweetId))) {
        next(new CustomError(400, 'Validation', "id of tweet is required"))
      }
      res.customSuccess(200, await this.tweetService.comment(req.jwtPayload.id, req.body, next));
    } catch {
      next();
    }
  };

  deleteTweet = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (isNaN(Number(req.params.id))) {
        next(new CustomError(400, 'Validation', "id of tweet is required"))
      }
      res.customSuccess(200, await this.tweetService.deleteTweet(Number(req.params.id), next));
    } catch {
      next();
    }
  };
}

export {TweetController};
