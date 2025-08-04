import express from "express";
import reviewsController from "../controllers/reviewsController.js";
import { authenticateUser } from "../middleware/auth.js";

const router = express.Router();

const {
  addReview,
  getSingleBookReview,
  getBookReviews,
  editUserReview,
  deleteUserReview,
} = reviewsController();

/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - user
 *         - book
 *         - rating
 *         - comment
 *       properties:
 *         _id:
 *           type: string
 *           description: Review ID
 *         user:
 *           type: string
 *           description: User ID
 *         book:
 *           type: string
 *           description: Book ID
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *           description: Rating value (1-5)
 *         comment:
 *           type: string
 *           description: Review comment
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   post:
 *     summary: Add a review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Rating and comment are required
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/:id", authenticateUser, addReview);

/**
 * @swagger
 * /api/v1/reviews/{id}/user:
 *   get:
 *     summary: Get the current user's review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Review retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       404:
 *         description: Review not found for this book
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id/user", authenticateUser, getSingleBookReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Get all reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Review'
 *       404:
 *         description: No reviews found for this book
 *       500:
 *         description: Server error
 */
router.get("/:id", getBookReviews);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Edit a user's review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Review'
 *       400:
 *         description: Rating and comment are required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to edit this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticateUser, editUserReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Delete a user's review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Review ID
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized to delete this review
 *       404:
 *         description: Review not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateUser, deleteUserReview);

export default router;
