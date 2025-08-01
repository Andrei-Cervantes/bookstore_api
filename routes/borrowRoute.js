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

// Route to create a borrow request
router.post(
  "/:bookId",
  authenticateUser,
  requireRole("user"),
  createBorrowRequest
);

// Route to get all borrow requests
router.get("/", authenticateUser, requireRole("user"), getUserBorrowRequests);

// Route to mark as returned
router.put(
  "/:id/return",
  authenticateUser,
  requireRole("user", "librarian"),
  returnBorrowRequest
);

// Route to get all borrow requests
router.get(
  "/borrow-requests",
  authenticateUser,
  requireRole("librarian", "admin"),
  getAllBorrowRequests
);

// Route to approve a borrow request
router.put(
  "/:id/approve",
  authenticateUser,
  requireRole("librarian", "admin"),
  approveBorrowRequest
);

// Route to reject a borrow request
router.put(
  "/:id/reject",
  authenticateUser,
  requireRole("librarian", "admin"),
  rejectBorrowRequest
);

export default router;
