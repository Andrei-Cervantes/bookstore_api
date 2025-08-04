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

/**
 * @swagger
 * components:
 *   schemas:
 *     BorrowRequestResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Borrow request ID
 *         user:
 *           type: string
 *           description: User ID who made the request
 *         book:
 *           type: string
 *           description: Book ID being borrowed
 *         status:
 *           type: string
 *           enum: [requested, approved, rejected, returned]
 *           description: Status of the borrow request
 *         requestedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was made
 *         approvedAt:
 *           type: string
 *           format: date-time
 *           description: When the request was approved
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: Due date for return
 *         returnedAt:
 *           type: string
 *           format: date-time
 *           description: When the book was returned
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BorrowRequestWithBookResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         book:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             author:
 *               type: string
 *         status:
 *           type: string
 *           enum: [requested, approved, rejected, returned]
 *         requestedAt:
 *           type: string
 *           format: date-time
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         returnedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     BorrowRequestWithUserAndBookResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             name:
 *               type: string
 *             email:
 *               type: string
 *         book:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             author:
 *               type: string
 *         status:
 *           type: string
 *           enum: [requested, approved, rejected, returned]
 *         requestedAt:
 *           type: string
 *           format: date-time
 *         approvedAt:
 *           type: string
 *           format: date-time
 *         dueDate:
 *           type: string
 *           format: date-time
 *         returnedAt:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/borrow/{bookId}:
 *   post:
 *     summary: Create a borrow request for a book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID to borrow
 *     responses:
 *       201:
 *         description: Borrow request created successfully
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
 *                   type: object
 *                   properties:
 *                     borrowRequest:
 *                       $ref: '#/components/schemas/BorrowRequestResponse'
 *       400:
 *         description: Bad request (book already requested)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not user role)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post(
  "/:bookId",
  authenticateUser,
  requireRole("user"),
  createBorrowRequest
);

/**
 * @swagger
 * /api/v1/borrow:
 *   get:
 *     summary: Get all borrow requests for the current user
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Borrow requests fetched successfully
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
 *                   type: object
 *                   properties:
 *                     borrowRequests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRequestWithBookResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not user role)
 *       500:
 *         description: Server error
 */
router.get("/", authenticateUser, requireRole("user"), getUserBorrowRequests);

/**
 * @swagger
 * /api/v1/borrow/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Book returned successfully
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
 *                   type: object
 *                   properties:
 *                     borrowRequest:
 *                       $ref: '#/components/schemas/BorrowRequestResponse'
 *       400:
 *         description: Bad request (book already returned, not approved)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not user/librarian role, not owner)
 *       404:
 *         description: Borrow request not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/return",
  authenticateUser,
  requireRole("user", "librarian"),
  returnBorrowRequest
);

/**
 * @swagger
 * /api/v1/borrow/borrow-requests:
 *   get:
 *     summary: Get all borrow requests (Librarian/Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All borrow requests fetched successfully
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
 *                   type: object
 *                   properties:
 *                     borrowRequests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/BorrowRequestWithUserAndBookResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not librarian/admin role)
 *       500:
 *         description: Server error
 */
router.get(
  "/borrow-requests",
  authenticateUser,
  requireRole("librarian", "admin"),
  getAllBorrowRequests
);

/**
 * @swagger
 * /api/v1/borrow/{id}/approve:
 *   put:
 *     summary: Approve a borrow request (Librarian/Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Borrow request approved successfully
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
 *                   type: object
 *                   properties:
 *                     borrowRequest:
 *                       $ref: '#/components/schemas/BorrowRequestResponse'
 *       400:
 *         description: Bad request (already approved/rejected/returned, book unavailable)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not librarian/admin role)
 *       404:
 *         description: Borrow request not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/approve",
  authenticateUser,
  requireRole("librarian", "admin"),
  approveBorrowRequest
);

/**
 * @swagger
 * /api/v1/borrow/{id}/reject:
 *   put:
 *     summary: Reject a borrow request (Librarian/Admin only)
 *     tags: [Borrow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Borrow request ID
 *     responses:
 *       200:
 *         description: Borrow request rejected successfully
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
 *                   type: object
 *                   properties:
 *                     borrowRequest:
 *                       $ref: '#/components/schemas/BorrowRequestResponse'
 *       400:
 *         description: Bad request (already approved/rejected/returned)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not librarian/admin role)
 *       404:
 *         description: Borrow request not found
 *       500:
 *         description: Server error
 */
router.put(
  "/:id/reject",
  authenticateUser,
  requireRole("librarian", "admin"),
  rejectBorrowRequest
);

export default router;
