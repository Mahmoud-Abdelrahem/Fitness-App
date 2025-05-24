import asyncHandler from "express-async-handler";
import User from "./userModel.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcryptjs";

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    data: {
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      gender: user.gender,
      dateOfBirth: user.dateOfBirth,
      weight: user.weight,
      height: user.height,
    },
  });
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email, phoneNumber, gender, dateOfBirth, weight, height } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      email,
      phoneNumber,
      gender,
      dateOfBirth,
      weight,
      height,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

export const updateProfilePicture = asyncHandler(async (req, res) => {
  const { avatar } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.avatar = avatar;
  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      avatar: user.avatar,
    },
  });
});
