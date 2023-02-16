"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = __importDefault(require("typedi"));
const tweet_controller_1 = require("../controllers/tweet.controller");
const tweetController = typedi_1.default.get(tweet_controller_1.TweetController);
const router = (0, express_1.Router)();
router.post('/', tweetController.createTweet);
router.get('/', tweetController.getTweets);
router.patch('/like/:id', tweetController.likeTweet);
router.delete('/delete', tweetController.deleteTweet);
router.post('/comment', tweetController.comment);
exports.default = router;
//# sourceMappingURL=tweet.js.map