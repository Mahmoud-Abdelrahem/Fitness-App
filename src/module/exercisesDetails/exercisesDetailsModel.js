import mongoose from "mongoose";

const exerciseDetailsSchema = new mongoose.Schema(
    {
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        totalCaloriesBurned: {
            type: Number, 
            required: true,
        },
        steps: [
            {
                stepNumber: {
                    type: Number,
                    required: true,
                },
                title: {
                    type: String, 
                    required: true,
                },
                instruction: {
                    type: String, 
                    required: true,
                },
                caloriesBurned: {
                    type: Number, 
                    required: true,
                },
            },
        ],
        customRepetitions: [
            {
                caloriesBurned: {
                    type: Number,
                    required: true,
                },
                repetitions: {
                    type: Number,
                    required: true,
                },
            },
        ],
        video: {
            type: String, 
            required: false,
        },
    },
    {
        timestamps: true, 
    }
);

const ExerciseDetails = mongoose.model("ExerciseDetails", exerciseDetailsSchema);
export default ExerciseDetails;