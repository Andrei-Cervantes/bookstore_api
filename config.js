import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT;
export const mongoDBURL = process.env.MONGO_URI;
