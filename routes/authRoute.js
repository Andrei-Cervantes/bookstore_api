import express from "express";
import authController from "../controllers/authController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

// Destructure controller
const {
  register,
  login,
  verifyEmail,
  getCurrentUser,
  logout,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
  changePassword,
  updateUser,
} = authController();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Route to verify email
router.get("/verify-email/:token", verifyEmail);

// Route to resend verification email
router.post("/resend-verification-email", resendVerificationEmail);

// Route for forgot password
router.post("/forgot-password", forgotPassword);

// Route for reset password
router.post("/reset-password/:token", resetPassword);

// Route to refresh token (authenticated route)
router.post("/refresh-token", refreshToken);

// Route to change password (authenticated route)
router.post("/change-password", authenticateUser, changePassword);

// Route to get current user details (authenticated route)
router.get("/me", authenticateUser, getCurrentUser);

// Route to update user details (authenticated route)
router.put("/me", authenticateUser, updateUser);

// Route to logout current user (authenticated route)
router.post("/logout", authenticateUser, logout);

export default router;
