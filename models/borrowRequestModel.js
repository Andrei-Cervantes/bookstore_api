import mongoose from "mongoose";

const borrowRequestSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "returned"],
      default: "requested",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
    },
    returnedAt: {
      type: Date,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    // notes: {
    //   type: String,
    //   default: "",
    // },
  },
  {
    timestamps: true,
  }
);
export const BorrowRequest = mongoose.model(
  "BorrowRequest",
  borrowRequestSchema
);
