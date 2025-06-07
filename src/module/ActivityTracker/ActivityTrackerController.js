import asyncHandler from "express-async-handler";
import ActivityTracker from "./ActivityTrackerModel.js";
import AppError from "../../utils/AppError.js";

export const createActivityTracker = asyncHandler(async (req, res) => {
    const { dailyTarget } = req.body;

    const existingTracker = await ActivityTracker.findOne({ user: req.user._id });
    if (existingTracker) {
        throw new AppError("Activity tracker already exists for this user", 400);
    }

    const tracker = await ActivityTracker.create({
        user: req.user._id,
        dailyTarget,
    });

    res.status(201).json({
        status: "success",
        data: tracker,
    });
});

export const getActivityTracker = asyncHandler(async (req, res) => {
    const tracker = await ActivityTracker.findOne({ user: req.user._id });

    if (!tracker) {
        throw new AppError("Activity tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const updateDailyTarget = asyncHandler(async (req, res) => {
    const { waterIntake, footSteps } = req.body;

    const tracker = await ActivityTracker.findOneAndUpdate(
        { user: req.user._id },
        {
            $set: {
                "dailyTarget.waterIntake": waterIntake,
                "dailyTarget.footSteps": footSteps,
            },
        },
        { new: true, runValidators: true }
    );

    if (!tracker) {
        throw new AppError("Activity tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const addDailyProgress = asyncHandler(async (req, res) => {
    const { waterIntake, footSteps } = req.body;

    const tracker = await ActivityTracker.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                activityProgress: {
                    date: new Date(),
                    waterIntake,
                    footSteps,
                },
            },
        },
        { new: true, runValidators: true }
    );

    if (!tracker) {
        throw new AppError("Activity tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const addLatestActivity = asyncHandler(async (req, res) => {
    const { activityType, description } = req.body;

    const tracker = await ActivityTracker.findOneAndUpdate(
        { user: req.user._id },
        {
            $push: {
                latestActivities: {
                    activityType,
                    description,
                    timestamp: new Date(),
                },
            },
        },
        { new: true, runValidators: true }
    );

    if (!tracker) {
        throw new AppError("Activity tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        data: tracker,
    });
});

export const deleteActivityTracker = asyncHandler(async (req, res) => {
    const tracker = await ActivityTracker.findOneAndDelete({ user: req.user._id });

    if (!tracker) {
        throw new AppError("Activity tracker not found for this user", 404);
    }

    res.status(200).json({
        status: "success",
        message: "Activity tracker deleted successfully",
    });
});