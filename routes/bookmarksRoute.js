import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import bookmarksController from "../controllers/bookmarksController.js";

// Destructure controller
const { createBookmark, getBookmarks, deleteBookmark } = bookmarksController();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookmarkRequest:
 *       type: object
 *       required:
 *         - bookId
 *       properties:
 *         bookId:
 *           type: string
 *           description: ID of the book to bookmark
 *     BookmarkResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Bookmark ID
 *         user:
 *           type: string
 *           description: User ID who created the bookmark
 *         book:
 *           type: string
 *           description: Book ID that was bookmarked
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     BookmarkWithBookResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Bookmark ID
 *         user:
 *           type: string
 *           description: User ID who created the bookmark
 *         book:
 *           $ref: '#/components/schemas/Book'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BookmarkListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             bookmarks:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BookmarkWithBookResponse'
 */

/**
 * @swagger
 * /api/v1/bookmarks:
 *   post:
 *     summary: Create a new bookmark
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookmarkRequest'
 *     responses:
 *       201:
 *         description: Bookmark created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/BookmarkResponse'
 *       400:
 *         description: Bad request (bookmark already exists)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post("/", authenticateUser, createBookmark);

/**
 * @swagger
 * /api/v1/bookmarks:
 *   get:
 *     summary: Get all bookmarks for the current user
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bookmarks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookmarkListResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authenticateUser, getBookmarks);

/**
 * @swagger
 * /api/v1/bookmarks/{id}:
 *   delete:
 *     summary: Delete a bookmark
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Bookmark ID
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the bookmark owner)
 *       404:
 *         description: Bookmark not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateUser, deleteBookmark);

export default router;
