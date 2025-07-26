import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "librarian"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: true, // change to false after email verification
    },
  },
  {
    timestamps: true,
  }
);
export const User = mongoose.model("User", userSchema);
