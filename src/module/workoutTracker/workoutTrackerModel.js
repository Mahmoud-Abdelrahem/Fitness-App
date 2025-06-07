import mongoose from "mongoose";

const workoutTrackerSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        upcomingWorkouts: [
            {
                title: { type: String, required: true },
                date: { type: Date, required: true },
                isCompleted: { type: Boolean, default: false },
                notificationEnabled: { type: Boolean, default: true },
                image: { type: String },
            }
        ],
        completedWorkouts: [
            {
                title: {
                    type: String,
                    required: true,
                },
                date: {
                    type: Date,
                    required: true,
                },
                duration: {
                    type: Number,
                    required: true,
                },
                caloriesBurned: {
                    type: Number,
                    required: true,
                },
                image: { type: String }, 
            },
        ],
        availableWorkouts: [
            {
                title: {
                    type: String,
                    required: true,
                },
                exercises: {
                    type: Number,
                    required: true,
                },
                duration: {
                    type: Number,
                    required: true,
                },
                image: {
                    type: String,
                    required: false,
                },
            },
        ],
        weeklyProgress: [
            {
                day: {
                    type: String,
                    required: true,
                },
                progress: {
                    type: Number,
                    required: true,
                    default: 0,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const WorkoutTracker = mongoose.model("WorkoutTracker", workoutTrackerSchema);
export default WorkoutTracker;