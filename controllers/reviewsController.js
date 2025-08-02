import { Review } from '../models/reviewModel.js';
import { errorResponse, successResponse } from '../utils/formatResponse.js';

const reviewsController = () => {
    const addReview = async (req, res) => {
        try {
            const { id: bookId } = req.params;
            const { rating, comment } = req.body;

            if (!rating || !comment) {
                return errorResponse(res, 400, 'Rating and comment are required');
            }

            const review = new Review({
                user: req.user._id,
                book: bookId,
                rating,
                comment
            });

            await review.save();
            return successResponse(res, 201, 'Review added successfully', review);
        } catch (error) {
            console.error(error);
            return errorResponse(res, 500, 'Server error');
        }
    }

    const getSingleBookReview = async (req, res) => {
        try {
            const { id: bookId } = req.params;
            const userId = req.user._id;

            // get the review by user and book
            const review = await Review.findOne({ user: userId, book: bookId });

            if (!review) {
                return errorResponse(res, 404, 'Review not found for this book');
            }

            return successResponse(res, 200, 'Review retrieved successfully', review);
        } catch (error) {
            console.error(error);
            return errorResponse(res, 500, 'Server error');
        }
    }

    const getBookReviews = async (req, res) => {
        try {
            const { id: bookId } = req.params;
            const reviews = await Review.find({ book: bookId }).populate('user', 'name email').populate('book', 'title author').sort({ createdAt: -1 });

            if (!reviews || reviews.length === 0) {
                return errorResponse(res, 200, 'No reviews found for this book');
            }

            return successResponse(res, 200, 'Reviews retrieved successfully', reviews);
        } catch (error) {
            console.error(error);
            return errorResponse(res, 500, 'Server error');
        }
    }

    const editUserReview = async (req, res) => {
        try {
            const { id: reviewId } = req.params;
            const { rating, comment } = req.body;

            if (!rating || !comment) {
                return errorResponse(res, 400, 'Rating and comment are required');
            }

            const review = await Review.findById(reviewId);
            if (!review) {
                return errorResponse(res, 404, 'Review not found');
            }

            if (review.user.toString() !== req.user._id.toString()) {
                return errorResponse(res, 403, 'You are not authorized to edit this review');
            }

            review.rating = rating;
            review.comment = comment;
            await review.save();

            return successResponse(res, 200, 'Review updated successfully', review);
        } catch (error) {
            console.error(error);
            return errorResponse(res, 500, 'Server error');
        }
    }

    const deleteUserReview = async (req, res) => {
        try {
            const { id: reviewId } = req.params;

            const review = await Review.findById(reviewId);
            if (!review) {
                return errorResponse(res, 404, 'Review not found');
            }

            if (review.user.toString() !== req.user._id.toString()) {
                return errorResponse(res, 403, 'You are not authorized to delete this review');
            }

            await review.deleteOne();
            return successResponse(res, 200, 'Review deleted successfully');
        } catch (error) {
            console.error(error);
            return errorResponse(res, 500, 'Server error');
        }
    }

    return {
        addReview,
        getSingleBookReview,
        getBookReviews,
        editUserReview,
        deleteUserReview
    }
}

export default reviewsController;