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
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
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

  const returnBorrowRequest = async (req, res) => {};

  const getAllBorrowRequests = async (req, res) => {};

  const approveBorrowRequest = async (req, res) => {};

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
