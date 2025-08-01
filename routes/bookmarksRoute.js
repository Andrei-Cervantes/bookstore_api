import express from "express";
import { authenticateUser } from "../middleware/auth.js";
import bookmarksController from "../controllers/bookmarksController.js";

// Destructure controller
const { createBookmark, getBookmarks, deleteBookmark } = bookmarksController();
const router = express.Router();

router.post("/", authenticateUser, createBookmark);

router.get("/", authenticateUser, getBookmarks);

router.delete("/:id", authenticateUser, deleteBookmark);

export default router;
