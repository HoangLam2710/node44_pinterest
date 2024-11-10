import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const createMailForgotPassword = (email, randomCode) => {
  return {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Code reset password",
    html: `
      <p>System has received a request to reset the password of your account. If you are not the one who requested, please ignore this email.</p>
      <p>Otherwise, please use the following code to reset your password</p>
      <p>Your code: <strong>${randomCode}</strong></p>
      <p>Code is valid for 3 minutes</p>
    `,
  };
};

export { transporter, createMailForgotPassword };
