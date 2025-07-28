import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { JWT_SECRET } from "../config.js";
import { errorResponse } from "../utils/formatResponse.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, 401, "Unauthorized");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user || !user.isVerified || !user.isActive) {
      return errorResponse(res, 401, "Unauthorized");
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

export const requireAdmin = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return errorResponse(res, 403, "Forbidden");
  }
  next();
};
