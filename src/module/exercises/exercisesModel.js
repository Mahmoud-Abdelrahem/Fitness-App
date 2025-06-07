import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
    {
        workout: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutTracker",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, 
            required: true,
        },
        repetitions: {
            type: Number, 
            required: false,
        },
        image: {
            type: String, 
            required: false,
        },
        equipment: [
            {
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String, 
                    required: false,
                },
            },
        ],
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true,
        },
        caloriesBurned: {
            type: Number, 
            required: true,
        },
    },
    {
        timestamps: true, 
    }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;