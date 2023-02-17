import { EventEmitter } from 'events';
import nodemailer from 'nodemailer';

const emailNotification = new EventEmitter();
emailNotification.addListener('registration', async (email: string, name: string, otp: string) => {
  welcomeMail(email, name, otp);
});

emailNotification.addListener('forgotPassword', async (email: string, token: string) => {
    forgotPasswordMail(email, token);
});

function sendEmail(email: string, text: string, subject: string) {
  const transporter = nodemailer.createTransport({
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
      address: 'info@twita.com',
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
  } catch {
    throw new Error('email did not send ooo');
  }
}
function forgotPasswordMail(token: string, email: string) {
  const text = `<p>This token expires in 15 minutes</p><p>${token}</p><p>If you didn’t initiate this request, you can ignore this mail.</p><p>Thanks,</p><p>From Twitee</p>`;
  const subject = 'Forgot Passowrd';
  const result = sendEmail(email, text, subject);
  return result;
}

function welcomeMail(email: string, name: string, otp: string) {
  const text = `<p>Hello ${name},</p><p>Welcome to Twitee.</p><p>Use this OTP - ${otp} to verify your email address, It lasts for only five minutes</p><p></p><p>Thanks,</p><p>From Twitee</p>`;
  const subject = "Twitee";
  const result = sendEmail(email, text, subject);
  return result;
}

export default emailNotification
