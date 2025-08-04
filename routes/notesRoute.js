import express from "express";
import { authenticateUser, requireRole } from "../middleware/auth.js";
import notesController from "../controllers/notesController.js";

// Destructure controller methods
const { addNote, getNotes, editNote, deleteNote } = notesController();
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateNoteRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: Note content
 *     UpdateNoteRequest:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: Updated note content
 *     NoteResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Note ID
 *         user:
 *           type: string
 *           description: User ID who created the note
 *         book:
 *           type: string
 *           description: Book ID the note is for
 *         content:
 *           type: string
 *           description: Note content
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     NoteWithBookResponse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Note ID
 *         user:
 *           type: string
 *           description: User ID who created the note
 *         book:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             author:
 *               type: string
 *         content:
 *           type: string
 *           description: Note content
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     NoteListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NoteWithBookResponse'
 */

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   post:
 *     summary: Add a note for a book
 *     tags: [Notes]
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
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *     responses:
 *       200:
 *         description: Note added successfully
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
 *                   $ref: '#/components/schemas/NoteResponse'
 *       400:
 *         description: Bad request (content is required)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not user role)
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post("/:id", authenticateUser, requireRole("user"), addNote);

/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     summary: Get all notes for the current user
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notes retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NoteListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not user role)
 *       404:
 *         description: No notes found
 *       500:
 *         description: Server error
 */
router.get("/", authenticateUser, requireRole("user"), getNotes);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   put:
 *     summary: Edit a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNoteRequest'
 *     responses:
 *       200:
 *         description: Note updated successfully
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
 *                   $ref: '#/components/schemas/NoteResponse'
 *       400:
 *         description: Bad request (content is required)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not user role, not note owner)
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authenticateUser, requireRole("user"), editNote);

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
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
 *         description: Forbidden (not user role, not note owner)
 *       404:
 *         description: Note not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authenticateUser, requireRole("user"), deleteNote);

export default router;
