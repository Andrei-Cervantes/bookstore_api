import { Book } from "../models/bookModel.js";

const booksController = () => {
  // Save a new book
  const createBook = async (req, res) => {
    try {
      const book = await Book.create(req.body);
      return res.status(201).send(book);
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  };

  // Get all books
  const getAllBooks = async (req, res) => {
    try {
      const books = await Book.find({});

      return res.status(200).json({
        count: books.length,
        data: books,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  };

  // Get one book by id
  const getSingleBook = async (req, res) => {
    try {
      const { id } = req.params;

      const book = await Book.findById(id);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json(book);
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  };

  // Update a book
  const updateBook = async (req, res) => {
    try {
      const { id } = req.params;

      const book = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Book updated successfully",
        data: book,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return res.status(400).send({
          message: "Validation failed",
          errors: Object.values(error.errors).map((err) => err.message),
        });
      }
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  };

  // Delete a book
  const deleteBook = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await Book.findByIdAndDelete(id);

      if (!result) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).send({ message: "Book deleted successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send({ message: error.message });
    }
  };

  return { createBook, getAllBooks, getSingleBook, updateBook, deleteBook };
};

export default booksController;
