import express from "express";
import authController from "../controllers/authController";

const router = express.Router();

// Destructure controller
const { register, login, verifyEmail, getCurrentUser, logout } =
  authController();

// Register Route
router.post("/register", register);

// Login Route
router.post("/login", login);

// Route to verify email
router.get("/verify-email", verifyEmail);

// Route to get current user details
router.get("/me", getCurrentUser);

// Route to logout current user
router.post("/logout", logout);

export default router;
