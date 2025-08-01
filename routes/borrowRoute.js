import express from "express";
import borrowController from "../controllers/borrowController.js";
import { authenticateUser, requireRole } from "../middleware/auth.js";

// Destructure controller
const {
  createBorrowRequest,
  getUserBorrowRequests,
  returnBorrowRequest,
  getAllBorrowRequests,
  approveBorrowRequest,
  rejectBorrowRequest,
} = borrowController();
const router = express.Router();

router.post(
  "/:bookId",
  authenticateUser,
  requireRole("admin", "librarian"),
  createBorrowRequest
);
export default router;
