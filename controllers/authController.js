import { User } from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/formatResponse.js";
import generateToken from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import validator from "validator";

// bcrypt configurations
// const saltRounds = 10;

const authController = () => {
  const register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      // check if email already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return errorResponse(res, 400, "User already exists");
      }

      // check if email is valid
      if (!validator.isEmail(email)) {
        return errorResponse(res, 400, "Invalid email");
      }

      // check if password is strong
      if (!validator.isStrongPassword(password)) {
        return errorResponse(res, 400, "Password is not strong enough");
      }

      // create user
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedPassword,
      });

      // generate verification token
      const verificationToken = generateToken(user._id);

      // update user with verification token and save
      user.verificationToken = verificationToken;
      await user.save();

      // send verification email
      await sendEmail(
        email,
        "Verify your email",
        `Click the link to verify your email: ${process.env.BASE_URL}/verify-email/${verificationToken}`
      );

      return successResponse(res, 201, "User created successfully", {
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        avatar: user.avatar,
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

  const verifyEmail = async (req, res) => {
    const { token } = req.params;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      // check if user exists
      if (!user || user.isVerified) {
        return errorResponse(res, 400, "Invalid or expired token");
      }

      // validate user
      user.isVerified = true;
      user.verificationToken = undefined;
      await user.save();

      return successResponse(res, 200, "Email verified successfully");
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });

      // check if user exists
      if (!user) {
        return errorResponse(res, 400, "User not found");
      }

      // check if user is already verified
      if (user.isVerified) {
        return errorResponse(res, 400, "Email already verified");
      }

      // generate verification token
      const verificationToken = generateToken(user._id);
      user.verificationToken = verificationToken;
      await user.save();

      // send verification email
      await sendEmail(
        email,
        "Verify your email",
        `Click the link to verify your email: ${process.env.BASE_URL}/verify-email/${verificationToken}`
      );

      return successResponse(res, 200, "Verification email sent successfully");
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const getCurrentUser = async (req, res) => {};

  const logout = async (req, res) => {};

  return {
    register,
    login,
    verifyEmail,
    resendVerificationEmail,
    getCurrentUser,
    logout,
  };
};

export default authController;
