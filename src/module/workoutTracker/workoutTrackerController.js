import asyncHandler from "express-async-handler";
import WorkoutTracker from "./workoutTrackerModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createWorkoutTracker = asyncHandler(async (req, res) => {
    let { upcomingWorkouts, availableWorkouts, weeklyProgress } = req.body;

    const existingTracker = await WorkoutTracker.findOne({ user: req.user._id });
    if (existingTracker) {
        throw new AppError("Workout tracker already exists for this user", 400);
    }

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "workoutTracker/images");
    }

    if (typeof upcomingWorkouts === "string") {
        upcomingWorkouts = JSON.parse(upcomingWorkouts);
    }

    if (typeof availableWorkouts === "string") {
        availableWorkouts = JSON.parse(availableWorkouts);
    }

    if (typeof weeklyProgress === "string") {
        weeklyProgress = JSON.parse(weeklyProgress);
    }

    if (Array.isArray(availableWorkouts)) {
        availableWorkouts = availableWorkouts.map(workout => ({
            ...workout,
            image: imageUrl || workout.image,
        }));
    }

    const tracker = await WorkoutTracker.create({
        user: req.user._id,
        upcomingWorkouts: upcomingWorkouts || [],
        availableWorkouts: availableWorkouts || [],
        weeklyProgress: weeklyProgress || [],
    });

    res.status(201).json({
        status: "success",
        data: tracker,
    });
});

export const getWorkoutTracker = asyncHandler(async (req, res) => {
    const tracker = await WorkoutTracker.findOne({ user: req.user._id });

    if (!tracker) {
        throw new AppError("Workout tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const addUpcomingWorkout = asyncHandler(async (req, res) => {
    const { title, date, notificationEnabled } = req.body;

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "workoutTracker/upcoming");
    }

    const tracker = await WorkoutTracker.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                upcomingWorkouts: {
                    title,
                    date,
                    isCompleted: false,
                    notificationEnabled,
                    image: imageUrl,
                },
            },
        },
        { new: true, runValidators: true }
    );

    if (!tracker) {
        throw new AppError("Workout tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const updateWeeklyProgress = asyncHandler(async (req, res) => {
    const { day, progress } = req.body;

    const tracker = await WorkoutTracker.findOne({ user: req.user._id });

    if (!tracker) {
        throw new AppError("Workout tracker not found for this user", 404);
    }

    const dayIndex = tracker.weeklyProgress.findIndex(wp => wp.day === day);

    if (dayIndex !== -1) {
        tracker.weeklyProgress[dayIndex].progress = progress;
    } else {
        tracker.weeklyProgress.push({ day, progress });
    }

    await tracker.save();

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});


export const addCompletedWorkout = asyncHandler(async (req, res) => {
    const { title, date, duration, caloriesBurned } = req.body;

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "workoutTracker/completed");
    }

    const tracker = await WorkoutTracker.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                completedWorkouts: {
                    title,
                    date,
                    duration,
                    caloriesBurned,
                    image: imageUrl,
                },
            },
        },
        { new: true, runValidators: true }
    );

    if (!tracker) {
        throw new AppError("Workout tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const deleteUpcomingWorkout = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;

    const tracker = await WorkoutTracker.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: {
                upcomingWorkouts: { _id: workoutId },
            },
        },
        { new: true }
    );

    if (!tracker) {
        throw new AppError("Workout tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        message: "Upcoming workout deleted successfully",
        data: tracker,
    });
});