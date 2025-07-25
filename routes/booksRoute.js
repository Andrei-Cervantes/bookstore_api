import express from "express";
import booksController from "../controllers/booksController.js";

const router = express.Router();

// Destructure Controllers
const { createBook, getAllBooks, getSingleBook, updateBook, deleteBook } =
  booksController();

// Route for Save a new book
router.post("/", createBook);

// Route for Get All Books from database
// Refactor to get all active and not archived books
router.get("/", getAllBooks);

// Admin Route for getting all books

// Route for Get One Book from database
router.get("/:id", getSingleBook);

// Route for Update a Book
router.put("/:id", updateBook);

// Route for Delete a Book
router.delete("/:id", deleteBook);

export default router;
