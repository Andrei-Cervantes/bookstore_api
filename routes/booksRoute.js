import express from "express";
import booksController from "../controllers/booksController.js";

const router = express.Router();

// Destructure Controllers
const { createBook, getAllBooks, getSingleBook, updateBook, deleteBook } =
  booksController();

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBookRequest:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - publishYear
 *         - genre
 *         - pages
 *         - language
 *         - description
 *         - coverImageUrl
 *         - location
 *       properties:
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         publishYear:
 *           type: number
 *           description: Year the book was published
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Book genres
 *         pages:
 *           type: number
 *           description: Number of pages
 *         language:
 *           type: string
 *           description: Book language
 *         description:
 *           type: string
 *           description: Book description
 *         coverImageUrl:
 *           type: string
 *           description: URL to book cover image
 *         location:
 *           type: string
 *           description: Physical location of the book
 *     UpdateBookRequest:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Book title
 *         author:
 *           type: string
 *           description: Book author
 *         publishYear:
 *           type: number
 *           description: Year the book was published
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Book genres
 *         pages:
 *           type: number
 *           description: Number of pages
 *         language:
 *           type: string
 *           description: Book language
 *         description:
 *           type: string
 *           description: Book description
 *         coverImageUrl:
 *           type: string
 *           description: URL to book cover image
 *         location:
 *           type: string
 *           description: Physical location of the book
 *         availability:
 *           type: boolean
 *           description: Whether the book is available for borrowing
 *         isArchived:
 *           type: boolean
 *           description: Whether the book is archived
 *     BookListResponse:
 *       type: object
 *       properties:
 *         count:
 *           type: integer
 *           description: Total number of books
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Book'
 *     BookUpdateResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *         data:
 *           $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookRequest'
 *     responses:
 *       201:
 *         description: Book created successfully
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
 *                   $ref: '#/components/schemas/Book'
 *       400:
 *         description: Bad request (book already exists, validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.post("/", createBook);

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Books retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookListResponse'
 *       500:
 *         description: Server error
 */
router.get("/", getAllBooks);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   get:
 *     summary: Get a single book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getSingleBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Books]
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
 *             $ref: '#/components/schemas/UpdateBookRequest'
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookUpdateResponse'
 *       400:
 *         description: Bad request (validation error)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.put("/:id", updateBook);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Book ID
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteBook);

export default router;
