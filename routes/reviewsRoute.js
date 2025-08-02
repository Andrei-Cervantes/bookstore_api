import express from "express";
import { authenticateUser, requireRole } from "../middleware/auth.js";
import reviewsController from "../controllers/reviewsController.js";

// Destructure controller
const { addReview, getSingleBookReview, getBookReviews, editUserReview, deleteUserReview } = reviewsController();
const router = express.Router();

// Route to add review
router.post("/:id", authenticateUser, requireRole("user"), addReview)

// Route to get user's review for a book
router.get("/user/:id", authenticateUser, requireRole("user"), getSingleBookReview)

// Route to get reviews for a book
router.get("/:id", authenticateUser, getBookReviews)

// Route to edit a user's review
router.put("/:id", authenticateUser, requireRole("user"), editUserReview)

// Route to delete a user's review
router.delete("/:id", authenticateUser, requireRole("user"), deleteUserReview)

export default router;
