import asyncHandler from "express-async-handler";
import Workout from "./workoutModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";


export const createWorkout = asyncHandler(async (req, res) => {
    const { title, exercises, duration } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "workouts/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const workout = await Workout.create({ title, exercises, duration, image: imageUrl });
    res.status(201).json({ success: true, data: workout });
});


export const getAllWorkouts = asyncHandler(async (req, res) => {
    const workouts = await Workout.find();
    res.status(200).json({ success: true, data: workouts });
});


export const getWorkoutById = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;
    const workout = await Workout.findById(workoutId);
    if (!workout) throw new AppError("Workout not found", 404);
    res.status(200).json({ success: true, data: workout });
});


export const updateWorkout = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;
    const { title, exercises, duration } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "workouts/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const workout = await Workout.findById(workoutId);
    if (!workout) throw new AppError("Workout not found", 404);

    if (title) workout.title = title;
    if (exercises) workout.exercises = exercises;
    if (duration) workout.duration = duration;
    if (imageUrl) workout.image = imageUrl;

    await workout.save();

    res.status(200).json({ success: true, data: workout });
});


export const deleteWorkout = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;

    const workout = await Workout.findById(workoutId);
    if (!workout) throw new AppError("Workout not found", 404);

    await workout.deleteOne();

    res.status(200).json({ success: true, message: "Workout deleted successfully" });
});