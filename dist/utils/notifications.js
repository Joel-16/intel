"use strict";
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
const events_1 = require("events");
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailNotification = new events_1.EventEmitter();
emailNotification.addListener('registration', (email, name, otp) => __awaiter(void 0, void 0, void 0, function* () {
    welcomeMail(email, name, otp);
}));
emailNotification.addListener('forgotPassword', (email, token) => __awaiter(void 0, void 0, void 0, function* () {
    forgotPasswordMail(email, token);
}));
function sendEmail(email, text, subject) {
    const transporter = nodemailer_1.default.createTransport({
        host: 'qlabafrica.com',
        port: 465,
        secure: true,
        auth: {
            user: 'inaku.j@qlabafrica.com',
            pass: '3YpV!]wwvk$3',
        },
    });
    const info = {
        from: {
            name: "Twitee",
            address: 'inaku.j@qlabafrica.com',
        },
        to: email,
        subject: subject,
        html: text,
    };
    try {
        transporter.sendMail(info, (err, inf) => {
            console.log(inf);
        });
        return true;
    }
    catch (_a) {
        throw new Error('email did not send ooo');
    }
}
function forgotPasswordMail(token, email) {
    const text = `<p>This token expires in 15 minutes</p><p>${token}</p><p>If you didn’t initiate this request, you can ignore this mail.</p><p>Thanks,</p><p>From Twitee</p>`;
    const subject = 'Forgot Passowrd';
    const result = sendEmail(email, text, subject);
    return result;
}
function welcomeMail(email, name, otp) {
    const text = `<p>Hello ${name},</p><p>Welcome to Twitee.</p><p>Use this OTP - ${otp} to verify your email address, It lasts for only five minutes</p><p></p><p>Thanks,</p><p>From Twitee</p>`;
    const subject = "Twitee";
    const result = sendEmail(email, text, subject);
    return result;
}
exports.default = emailNotification;
//# sourceMappingURL=notifications.js.map