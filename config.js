import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const mongoDBURL = process.env.MONGO_URI;
export const EMAIL_USER = process.env.SMTP_USER;
export const EMAIL_PASS = process.env.SMTP_PASS;
export const JWT_SECRET = process.env.JWT_SECRET;
export const BASE_URL = process.env.BASE_URL;
export const SMTP_HOST = process.env.SMTP_HOST;
export const SMTP_PORT = process.env.SMTP_PORT;
