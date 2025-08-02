import { Book } from "../models/bookModel.js";
import { Note } from "../models/noteModel.js";
import { errorResponse, successResponse } from "../utils/formatResponse.js";

const notesController = () => {
    const addNote = async (req, res) => {
        try {
            const { id: bookId } = req.params;
            const { content } = req.body;
            
            if (!content) return errorResponse(res, 400, "Content is required");
                
            const book = await Book.findById(bookId);
            if (!book) return errorResponse(res, 404, "Book not found");

            const note = new Note({
                user: req.user._id,
                book: bookId,
                content
            })
            await note.save();

            return successResponse(res, 200, "Note added successfully", note);
        } catch (error) {
            console.error("Error adding note:", error);
            return errorResponse(res, 500, "Failed to add note");
        }
    }

    const getNotes = async (req, res) => {
        try {
            const userId = req.user._id;
            const notes = await Note.find({ user: userId }).populate("book", "title author");

            if (!notes || notes.length === 0) return errorResponse(res, 404, "No notes found");

            return successResponse(res, 200, "Notes retrieved successfully", notes);
        } catch (error) {
            console.error("Error retrieving notes:", error);
            return errorResponse(res, 500, "Failed to retrieve notes");
        }
    }

    const editNote = async (req, res) => {
        try {
            const { id: noteId } = req.params;
            const { content } = req.body;

            if (!content) return errorResponse(res, 400, "Content is required");

            const note = await Note.findById(noteId);
            if (!note) return errorResponse(res, 404, "Note not found");

            if (note.user.toString() !== req.user._id.toString()) {
                return errorResponse(res, 403, "You are not authorized to edit this note");
            }

            note.content = content;
            await note.save();
            return successResponse(res, 200, "Note updated successfully", note);
        } catch (error) {
            console.error("Error updating note:", error);
            return errorResponse(res, 500, "Failed to update note");
        }
    }

    const deleteNote = async (req, res) => {
        try {
            const { id: noteId } = req.params;

            const note = await Note.findById(noteId);
            if (!note) return errorResponse(res, 404, "Note not found");

            if (note.user.toString() !== req.user._id.toString()) {
                return errorResponse(res, "You are not authorized to delete this note", 403);
            }

            await Note.findByIdAndDelete(noteId);
            return successResponse(res, 200, "Note deleted successfully");
        } catch (error) {
            console.error("Error deleting note:", error);
            return errorResponse(res, 500, "Failed to delete note");
        }
    }

    return {
        addNote,
        getNotes,
        editNote,
        deleteNote
    }
}

export default notesController;