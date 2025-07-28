import { User } from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/formatResponse.js";

const usersController = () => {
  const getAllUsers = async (req, res) => {};

  const getSingleUser = async (req, res) => {};

  const setUserRole = async (req, res) => {};

  const deleteUser = async (req, res) => {};

  return { getAllUsers, getSingleUser, setUserRole, deleteUser };
};

export default usersController;
