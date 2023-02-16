"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetController = void 0;
const typedi_1 = require("typedi");
const tweet_service_1 = __importDefault(require("../services/tweet.service"));
let TweetController = class TweetController {
    constructor(tweetService) {
        this.tweetService = tweetService;
        this.createTweet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.tweetService.createTweet(req.jwtPayload.id, req.body.content, next));
            }
            catch (_a) {
                next();
            }
        });
        this.getTweets = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.tweetService.getTweets(next));
            }
            catch (_b) {
                next();
            }
        });
        this.likeTweet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.tweetService.likeTweet(Number(req.params.id), next));
            }
            catch (_c) {
                next();
            }
        });
        this.comment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.tweetService.comment(req.jwtPayload.id, req.body, next));
            }
            catch (_d) {
                next();
            }
        });
        this.deleteTweet = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                res.customSuccess(200, yield this.tweetService.deleteTweet(req.body.tweetId, next));
            }
            catch (_e) {
                next();
            }
        });
    }
};
TweetController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [tweet_service_1.default])
], TweetController);
exports.TweetController = TweetController;
//# sourceMappingURL=tweet.controller.js.map