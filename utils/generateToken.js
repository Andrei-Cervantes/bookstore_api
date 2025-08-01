import jwt from "jsonwebtoken";
import CONFIG from "../config.js";

export const generateToken = (userId) => {
  return jwt.sign({ userId }, CONFIG.JWT_SECRET, {
    expiresIn: CONFIG.JWT_EXPIRES_IN,
  });
};

export const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, CONFIG.ACCESS_TOKEN_SECRET, {
    expiresIn: CONFIG.ACCESS_TOKEN_EXPIRY,
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, CONFIG.REFRESH_TOKEN_SECRET, {
    expiresIn: CONFIG.REFRESH_TOKEN_EXPIRY,
  });
};
