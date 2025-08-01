import express from "express";
import usersController from "../controllers/adminController.js";
import { requireRole } from "../middleware/auth.js";

const router = express.Router();

// Destructure controller
const { getAllUsers, getSingleUser, setUserRole, deleteUser } =
  usersController();

// Admin Route for getting all users
router.get("/users", requireRole("admin"), getAllUsers);

// Admin Route for getting a single user
router.get("/users/:id", requireRole("admin"), getSingleUser);

// Admin Route for setting user role (user, librarian, admin)
router.put("/users/:id/role", requireRole("admin"), setUserRole);

// Admin Route for deleting a user
router.delete("/users/:id", requireRole("admin"), deleteUser);

export default router;
