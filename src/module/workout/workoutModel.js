// models/Workout.js
import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
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
    },
}, {
    timestamps: true,
});

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
