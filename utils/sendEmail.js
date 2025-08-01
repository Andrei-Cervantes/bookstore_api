import nodemailer from "nodemailer";
import CONFIG from "../config.js";

const sendEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: CONFIG.SMTP_HOST,
    port: CONFIG.SMTP_PORT,
    auth: {
      user: CONFIG.SMTP_USER,
      pass: CONFIG.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Verify your email" <${CONFIG.SMTP_USER}>`,
    to: email,
    subject,
    text,
    html: `<p>${text}</p>`,
  });
};

export default sendEmail;
