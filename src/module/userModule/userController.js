import asyncHandler from "express-async-handler";
import User from "./userModel.js";
import AppError from "../../utils/AppError.js";
import bcrypt from "bcryptjs";
import { userUpdateValidationSchema } from "./userValidator.js";

export const createUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, phoneNumber, gender, dateOfBirth, weight, height, termsAccepted } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError("User already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    gender,
    dateOfBirth,
    weight,
    height,
    termsAccepted,
  });

  if (user) {
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        user,
      },
    });
  }
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find({});

  if (users) {
    res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: users,
    });
  }
});

export const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.userId);
  if (user) {
    res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: user,
    });
  }
});

export const updateUser = asyncHandler(async (req, res, next) => {
  const { error } = userUpdateValidationSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details.map((d) => d.message).join(", "), 400));
  }

  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedUser,
  });
});

export const changeUserPassword = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { currentUserPassword, password } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("User not found", 404));
  }

  const confirm = await req.user.comparePassword(currentUserPassword);

  if (!confirm) {
    return next(new AppError("Current password is incorrect", 401));
  }

  user.password = password;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password updated successfully",
  });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.userId );

  if (user) {
    return res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: user,
    });
  }
  return next(new AppError("User not found", 404));
});
