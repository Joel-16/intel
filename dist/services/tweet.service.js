"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const typedi_1 = require("typedi");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const CustomError_1 = require("../utils/response/custom-error/CustomError");
let TweetService = class TweetService {
    createTweet(id, content, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tweet = yield prisma.tweet.create({
                    data: {
                        content
                    }
                });
                yield prisma.user.update({
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
                return tweet;
            }
            catch (err) {
                return next(new CustomError_1.CustomError(400, 'Raw', 'Error'));
            }
        });
    }
    getTweets(next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield prisma.tweet.findMany({ include: {
                        comments: true
                    } });
            }
            catch (error) {
                return next(new CustomError_1.CustomError(400, 'Raw', 'Error'));
            }
        });
    }
    likeTweet(id, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let likes = yield prisma.tweet.findUnique({
                    where: {
                        id
                    }, select: {
                        likes: true
                    }
                });
                let tweet = yield prisma.tweet.update({
                    where: {
                        id
                    }, data: {
                        likes: likes.likes + 1
                    }
                });
                return tweet;
            }
            catch (error) {
                return next(new CustomError_1.CustomError(400, 'Raw', 'Error'));
            }
        });
    }
    comment(jwt, payload, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let comment = yield prisma.comments.create({
                    data: {
                        content: payload.content
                    }
                });
                yield prisma.user.update({
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
                let tweet = yield prisma.tweet.update({
                    where: {
                        id: payload.tweetId
                    }, data: {
                        comments: {
                            connect: {
                                id: comment.id
                            }
                        }
                    }, include: {
                        comments: true
                    }
                });
                return tweet;
            }
            catch (error) {
                return next(new CustomError_1.CustomError(400, 'Raw', 'Error'));
            }
        });
    }
    deleteTweet(tweetId, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield prisma.tweet.delete({
                    where: {
                        id: tweetId
                    }
                });
            }
            catch (error) {
                return next(new CustomError_1.CustomError(400, 'Raw', 'Error'));
            }
        });
    }
};
TweetService = __decorate([
    (0, typedi_1.Service)()
], TweetService);
exports.default = TweetService;
//# sourceMappingURL=tweet.service.js.map