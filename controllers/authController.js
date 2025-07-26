import { User } from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/formatResponse.js";
import bcrypt from "bcrypt";

// bcrypt configurations
const saltRounds = 10;

const authController = () => {
  const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // check if email already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return errorResponse(res, 400, "User already exists");
      }

      // create user
      const user = await User.create({ name, email, password: hashedPassword });
      return successResponse(res, 201, "User created successfully", {
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        return errorResponse(
          res,
          400,
          "Validation failed",
          Object.values(error.errors).map((err) => err.message)
        );
      }

      console.log(error.message);
      return errorResponse(res, 500, error.message);
    }
  };

  const login = async (req, res) => {};

  const verifyEmail = async (req, res) => {};

  const getCurrentUser = async (req, res) => {};

  const logout = async (req, res) => {};

  return { register, login, verifyEmail, getCurrentUser, logout };
};

export default authController;
