// src/module/ActivityTracker/ActivityTrackerModel.js

import mongoose from "mongoose";

const activityTrackerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        dailyTarget: {
            waterIntake: {
                type: Number,
                required: true,
                default: 2, // Default daily water intake in liters
            },
            footSteps: {
                type: Number,
                required: true,
                default: 10000, // Default daily foot steps target
            },
        },
        activityProgress: [
            {
                date: {
                    type: Date,
                    required: true,
                    default: Date.now,
                },
                waterIntake: {
                    type: Number,
                    required: true,
                    default: 0,
                },
                footSteps: {
                    type: Number,
                    required: true,
                    default: 0,
                },
            },
        ],
        latestActivities: [
            {
                activityType: {
                    type: String,
                    enum: ["water", "steps", "snack"],
                    required: true,
                },
                description: {
                    type: String,
                    required: true,
                },
                timestamp: {
                    type: Date,
                    required: true,
                    default: Date.now,
                },
            },
        ],
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

const ActivityTracker = mongoose.model(
    "ActivityTracker",
    activityTrackerSchema
);

export default ActivityTracker;
