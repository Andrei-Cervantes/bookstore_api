import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS, SMTP_HOST, SMTP_PORT } from "../config.js";

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Verify your email" <${EMAIL_USER}>`,
    to: email,
    subject,
    text,
    html: `<p>${text}</p>`,
  });
};

export default sendEmail;
