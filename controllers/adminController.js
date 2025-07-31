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

  const getSingleUser = async (req, res) => {};

  const setUserRole = async (req, res) => {};

  const deleteUser = async (req, res) => {};

  return { getAllUsers, getSingleUser, setUserRole, deleteUser };
};

export default usersController;
