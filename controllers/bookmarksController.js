import { Bookmark } from "../models/bookmarkModel.js";
import { Book } from "../models/bookModel.js";
import { errorResponse, successResponse } from "../utils/formatResponse.js";

const bookmarksController = () => {
  const createBookmark = async (req, res) => {
    try {
      const { bookId } = req.body;

      const hasBook = await Book.findById(bookId);
      if (!hasBook) {
        return errorResponse(res, 404, "Book not found");
      }

      const hasBookmark = await Bookmark.findOne({
        user: req.user._id,
        book: bookId,
      });
      
      if (hasBookmark) {
        return errorResponse(res, 400, "Bookmark already exists");
      }

      const newBookmark = await Bookmark.create({
        user: req.user._id,
        book: bookId,
      });

      return successResponse(
        res,
        201,
        "Bookmark created successfully",
        newBookmark
      );
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const getBookmarks = async (req, res) => {
    try {
      const bookmarks = await Bookmark.find({ user: req.user._id }).populate(
        "book"
      );

      if (!bookmarks.length) {
        return successResponse(res, 200, "No bookmarks found");
      }

      return successResponse(res, 200, "Bookmarks fetched successfully", {
        bookmarks,
      });
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const deleteBookmark = async (req, res) => {
    try {
      const { id } = req.params;

      const bookmark = await Bookmark.findById(id);
      if (!bookmark) {
        return errorResponse(res, 404, "Bookmark not found");
      }

      if (bookmark.user.toString() !== req.user._id.toString()) {
        return errorResponse(res, 403, "Unauthorized");
      }

      await Bookmark.findByIdAndDelete(id);

      return successResponse(res, 200, "Bookmark deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  return { createBookmark, getBookmarks, deleteBookmark };
};

export default bookmarksController;
