import express from "express";
import usersController from "../controllers/adminController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Destructure controller
const { getAllUsers, getSingleUser, setUserRole, deleteUser } =
  usersController();

// Admin Route for getting all users
router.get("/users", requireAdmin, getAllUsers);

// Admin Route for getting a single user
router.get("/users/:id", requireAdmin, getSingleUser);

// Admin Route for setting user role (user, librarian, admin)
router.put("/users/:id/role", requireAdmin, setUserRole);

// Admin Route for deleting a user
router.delete("/users/:id", requireAdmin, deleteUser);

export default router;
