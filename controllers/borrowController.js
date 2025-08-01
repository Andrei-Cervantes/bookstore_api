import { Book } from "../models/bookModel.js";
import { BorrowRequest } from "../models/borrowRequestModel.js";
import { errorResponse, successResponse } from "../utils/formatResponse.js";

const borrowController = () => {
  const createBorrowRequest = async (req, res) => {
    try {
      const { bookId } = req.params;

      const book = await Book.findById(bookId);
      if (!book) return errorResponse(res, 404, "Book not found");

      // check if request already exists
      const existingRequest = await BorrowRequest.findOne({
        book: bookId,
        status: "requested",
      });

      if (existingRequest)
        return errorResponse(
          res,
          400,
          "Book already requested by another user"
        );

      const borrowRequest = await BorrowRequest.create({
        user: req.user._id,
        book: bookId,
        status: "requested",
      });

      return successResponse(res, 201, "Borrow request created successfully", {
        borrowRequest,
      });
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const getUserBorrowRequests = async (req, res) => {
    try {
      const user = req.user._id;

      const borrowRequests = await BorrowRequest.find({
        user: user,
      })
        .populate("book", "title author")
        .sort({ createdAt: -1 });

      return successResponse(res, 200, "Borrow requests fetched successfully", {
        borrowRequests,
      });
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const returnBorrowRequest = async (req, res) => {
    try {
      const { id } = req.params;

      const borrowRequest = await BorrowRequest.findById(id);
      if (!borrowRequest)
        return errorResponse(res, 404, "Borrow request not found");

      // check if request is already returned
      if (borrowRequest.status === "returned")
        return errorResponse(res, 400, "Book is already returned");

      const isOwner = borrowRequest.user.toString() === req.user._id.toString();
      const isLibrarian = req.user.role === "librarian";

      if (!isOwner && !isLibrarian)
        return errorResponse(
          res,
          403,
          "You are not authorized to return this book"
        );

      if (borrowRequest.status !== "approved")
        return errorResponse(
          res,
          400,
          "Only approved borrow requests can be returned"
        );

      // get book and update availability
      const book = await Book.findById(borrowRequest.book);
      if (!book) return errorResponse(res, 404, "Book not found");
      book.availability = true;
      await book.save();

      borrowRequest.status = "returned";
      borrowRequest.returnedAt = new Date();
      await borrowRequest.save();

      return successResponse(res, 200, "Borrowed book returned successfully", {
        borrowRequest,
      });
    } catch (error) {
      console.log(error.message);
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const getAllBorrowRequests = async (req, res) => {
    try {
      const allBorrowRequests = await BorrowRequest.find()
        .populate("book", "title author")
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      return successResponse(
        res,
        200,
        "All borrow requests fetched successfully",
        { borrowRequests: allBorrowRequests }
      );
    } catch (error) {
      console.log(error.message);
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const approveBorrowRequest = async (req, res) => {
    try {
      const { id } = req.params;

      const borrowRequest = await BorrowRequest.findById(id);
      if (!borrowRequest)
        return errorResponse(res, 404, "Borrow request not found");

      // check if request is approved
      if (borrowRequest.status === "approved")
        return errorResponse(res, 400, "Borrow request is already approved");

      // check if request is rejected
      if (borrowRequest.status === "rejected")
        return errorResponse(res, 400, "Borrow request is already rejected");

      // check if request is returned
      if (borrowRequest.status === "returned")
        return errorResponse(res, 400, "Borrow request is already returned");

      // check book availability
      const book = await Book.findById(borrowRequest.book);
      if (!book) return errorResponse(res, 404, "Book not found");

      if (!book.availability)
        return errorResponse(res, 400, "Book is currently unavailable");

      borrowRequest.status = "approved";
      borrowRequest.approvedAt = new Date();
      borrowRequest.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
      await borrowRequest.save();

      book.availability = false;
      await book.save();

      return successResponse(res, 200, "Borrow request approved successfully", {
        borrowRequest,
      });
    } catch (error) {
      console.log(error.message);
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const rejectBorrowRequest = async (req, res) => {};

  return {
    createBorrowRequest,
    getUserBorrowRequests,
    returnBorrowRequest,
    getAllBorrowRequests,
    approveBorrowRequest,
    rejectBorrowRequest,
  };
};

export default borrowController;
