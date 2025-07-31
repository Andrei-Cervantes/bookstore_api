import { User } from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/formatResponse.js";

const usersController = () => {
  const getAllUsers = async (req, res) => {
    try {
      // get all users
      const users = await User.find({});

      if (!users || users.length === 0) {
        return errorResponse(res, 404, "No users found");
      }

      return successResponse(res, 200, "Users fetched successfully", { users });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  };

  const getSingleUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      return successResponse(res, 200, "User fetched successfully", { user });
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  };

  const setUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      if (user.role === "admin") {
        return errorResponse(res, 400, "Cannot change admin role");
      }

      const { role } = req.body;

      if (!role || !["user", "librarian"].includes(role)) {
        return errorResponse(res, 400, "Invalid role");
      }

      user.role = role;
      await user.save();

      return successResponse(res, 200, "User role changed successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  };

  const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return errorResponse(res, 404, "User not found");
      }

      await user.deleteOne();

      return successResponse(res, 200, "User deleted successfully");
    } catch (error) {
      return errorResponse(res, 500, error.message);
    }
  };

  return { getAllUsers, getSingleUser, setUserRole, deleteUser };
};

export default usersController;
