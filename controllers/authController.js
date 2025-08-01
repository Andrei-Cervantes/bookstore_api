import { User } from "../models/userModel.js";
import { successResponse, errorResponse } from "../utils/formatResponse.js";
import {
  generateToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import validator from "validator";
import { JWT_SECRET } from "../config.js";

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
      const user = await User.create({
        name,
        email,
        password,
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

  const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, 400, "Email and password are required");
      }

      if (!validator.isEmail(email)) {
        return errorResponse(res, 400, "Invalid email");
      }

      // check if email exists
      const user = await User.findOne({ email });

      if (!user) {
        return errorResponse(res, 400, "User not found");
      }

      if (!user.isVerified) {
        return errorResponse(res, 400, "Email not verified");
      }

      if (!user.isActive) {
        return errorResponse(res, 400, "Account inactive");
      }

      // check if password is correct
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return errorResponse(res, 400, "Invalid password");
      }

      // generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // update user with refresh token
      user.refreshToken = refreshToken;
      await user.save();

      // send response
      return successResponse(res, 200, "Login successful", {
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
        avatar: user.avatar,
        tokens: {
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

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
      return errorResponse(res, 500, error.message);
    }
  };

  const forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email) {
        return errorResponse(res, 400, "Email is required");
      }

      if (!validator.isEmail(email)) {
        return errorResponse(res, 400, "Invalid email");
      }

      const user = await User.findOne({ email });
      if (!user) {
        // avoid leaking information about the existence of the email
        return successResponse(
          res,
          200,
          "If a user with this email exists, a reset password email has been sent"
        );
      }

      const resetToken = generateToken(user._id); // 15 mins token
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 mins
      await user.save();

      await sendEmail(
        email,
        "Reset your password",
        `Click the link to reset your password: ${process.env.BASE_URL}/reset-password/${resetToken}`
      );

      return successResponse(
        res,
        200,
        "If a user with this email exists, a reset password email has been sent"
      );
    } catch (error) {
      console.log(error.message);
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const resetPassword = async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return errorResponse(res, 400, "Token and password are required");
      }

      // decode token and check if it is valid
      let decoded;
      try {
        decoded = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        return errorResponse(res, 400, "Invalid or expired token");
      }

      const user = await User.findOne({
        _id: decoded.userId,
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      });

      if (!user) {
        return errorResponse(res, 400, "Invalid or expired token");
      }

      user.password = await bcrypt.hash(password, 10);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      return successResponse(res, 200, "Password reset successfully");
    } catch (error) {
      console.log(error.message);
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const changePassword = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return errorResponse(
          res,
          400,
          "Current password and new password are required"
        );
      }

      if (currentPassword === newPassword) {
        return errorResponse(
          res,
          400,
          "New password must be different from current password"
        );
      }

      const isPasswordCorrect = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isPasswordCorrect) {
        return errorResponse(res, 401, "Unauthorized, wrong password");
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return successResponse(res, 200, "Password changed successfully");
    } catch (error) {
      console.log(error.message);
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const refreshToken = async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return errorResponse(
          res,
          401,
          "Unauthorized, refresh token is required"
        );
      }

      const user = await User.findOne({ refreshToken });
      if (!user) {
        return errorResponse(res, 401, "Unauthorized, invalid refresh token");
      }

      if (user.refreshToken !== refreshToken) {
        return errorResponse(res, 401, "Unauthorized, invalid refresh token");
      }

      const newAccessToken = generateAccessToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      user.refreshToken = newRefreshToken;
      await user.save();

      return successResponse(res, 200, "Token refreshed successfully", {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      return successResponse(res, 200, "User fetched successfully", {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        isActive: user.isActive,
      });
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const updateUser = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      const { name, email, currentPassword, newPassword } = req.body;

      if (name?.trim()) {
        user.name = name.trim();
      }

      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return errorResponse(res, 400, "Email already exists");
        }
        user.email = email;
      }

      if (newPassword) {
        if (!currentPassword) {
          return errorResponse(res, 400, "Current password is required");
        }

        const isPasswordCorrect = await bcrypt.compare(
          currentPassword,
          user.password
        );

        if (!isPasswordCorrect) {
          return errorResponse(res, 401, "Unauthorized, wrong password");
        }

        user.password = await bcrypt.hash(newPassword, 10);
      }

      await user.save();
      return successResponse(res, 200, "User updated successfully");
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  const logout = async (req, res) => {
    try {
      const user = req.user;
      user.refreshToken = undefined;
      await user.save();

      return successResponse(res, 200, "Logged out successfully");
    } catch (error) {
      return errorResponse(res, 500, "Internal server error");
    }
  };

  return {
    register,
    login,
    verifyEmail,
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshToken,
    getCurrentUser,
    updateUser,
    logout,
  };
};

export default authController;
