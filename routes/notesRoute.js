import express from "express";
import { authenticateUser, requireRole } from "../middleware/auth.js";
import notesController from "../controllers/notesController.js";

// Destructure controller methods
const { addNote, getNotes, editNote, deleteNote } = notesController();
const router = express.Router();

router.post("/:id", authenticateUser, requireRole("user"), addNote);

router.get("/", authenticateUser, requireRole("user"), getNotes);

router.put("/:id", authenticateUser, requireRole("user"), editNote);

router.delete("/:id", authenticateUser, requireRole("user"), deleteNote);

export default router;
