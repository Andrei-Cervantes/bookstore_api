import mongoose from "mongoose";

const bookSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    publishYear: {
      type: Number,
      required: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    ISBN: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    coverImageUrl: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
export const Book = mongoose.model("Book", bookSchema);
