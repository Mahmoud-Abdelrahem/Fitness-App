import asyncHandler from "express-async-handler";
import ExerciseDetails from "./exercisesDetailsModel.js";
import AppError from "../../utils/AppError.js";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";

const tryParseJSON = (data) => {
  if (!data) return undefined;
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
};

export const createExerciseDetails = asyncHandler(async (req, res) => {
  const { exercise, title, description, totalCaloriesBurned } = req.body;
  const steps = tryParseJSON(req.body.steps) || [];
  const customRepetitions = tryParseJSON(req.body.customRepetitions) || [];

  let videoUrl = null;

  if (req.file) {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "exercises/videos",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    videoUrl = result.secure_url;
  }

  const existingDetails = await ExerciseDetails.findOne({ exercise });
  if (existingDetails) {
    throw new AppError("Details for this exercise already exist", 400);
  }

  const exerciseDetails = await ExerciseDetails.create({
    exercise,
    title,
    description,
    totalCaloriesBurned,
    steps,
    customRepetitions,
    video: videoUrl,
  });

  res.status(201).json({
    status: "success",
    data: exerciseDetails,
  });
});

export const getExerciseDetails = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const exerciseDetails = await ExerciseDetails.findOne({ exercise: exerciseId });

  if (!exerciseDetails) {
    throw new AppError("Details not found for this exercise", 404);
  }

  res.status(200).json({
    status: "success",
    data: exerciseDetails,
  });
});

export const updateExerciseDetails = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;
  const { title, description, totalCaloriesBurned } = req.body;
  const steps = tryParseJSON(req.body.steps);
  const customRepetitions = tryParseJSON(req.body.customRepetitions);

  let videoUrl = null;

  if (req.file) {
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "exercises/videos",
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);
    videoUrl = result.secure_url;
  }

  const updateData = {
    title,
    description,
    totalCaloriesBurned,
  };

  if (steps !== undefined) updateData.steps = steps;
  if (customRepetitions !== undefined) updateData.customRepetitions = customRepetitions;
  if (videoUrl) updateData.video = videoUrl;

  const exerciseDetails = await ExerciseDetails.findOneAndUpdate(
    { exercise: exerciseId },
    updateData,
    { new: true, runValidators: true }
  );

  if (!exerciseDetails) {
    throw new AppError("Details not found for this exercise", 404);
  }

  res.status(200).json({
    status: "success",
    data: exerciseDetails,
  });
});

export const deleteExerciseDetails = asyncHandler(async (req, res) => {
  const { exerciseId } = req.params;

  const exerciseDetails = await ExerciseDetails.findOneAndDelete({ exercise: exerciseId });

  if (!exerciseDetails) {
    throw new AppError("Details not found for this exercise", 404);
  }

  res.status(200).json({
    status: "success",
    message: "Exercise details deleted successfully",
  });
});
