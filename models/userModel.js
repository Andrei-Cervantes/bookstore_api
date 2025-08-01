import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "librarian"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
    avatar: {
      type: String,
      default: "",
    },
    isActive: {
      // For soft delete or account suspension
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Hash and store refresh token
userSchema.methods.setRefreshToken = async function (token) {
  const salt = await bcrypt.genSalt(10);
  this.refreshToken = await bcrypt.hash(token, salt);
  await this.save();
};

// Compare provided refresh token with stored hashed refresh token
userSchema.methods.verifyRefreshToken = async function (token) {
  if (!this.refreshToken) return false;
  return bcrypt.compare(token, this.refreshToken);
};

export const User = mongoose.model("User", userSchema);
