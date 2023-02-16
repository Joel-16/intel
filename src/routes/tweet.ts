import { Router } from 'express';
import Container from 'typedi';

import { TweetController } from '../controllers/tweet.controller';

const tweetController = Container.get(TweetController);
const router = Router();

router.post('/', tweetController.createTweet);
router.get('/', tweetController.getTweets);
router.patch('/like/:id', tweetController.likeTweet);
router.delete('/:id', tweetController.deleteTweet);

router.post('/comment', tweetController.comment)
export default router;
