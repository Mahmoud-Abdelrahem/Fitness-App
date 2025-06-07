import asyncHandler from "express-async-handler";
import Exercise from "./exercisesModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createExercise = asyncHandler(async (req, res) => {
    let { workout, title, duration, repetitions, equipment, difficulty, caloriesBurned } = req.body;

    if (typeof equipment === "string") {
        try {
            equipment = JSON.parse(equipment);
        } catch {
            throw new AppError("Invalid JSON format in 'equipment'", 400);
        }
    }

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "exercises/images");
    }

    const exercise = await Exercise.create({
        workout,
        title,
        duration,
        repetitions,
        image: imageUrl,
        equipment,
        difficulty,
        caloriesBurned,
    });

    res.status(201).json({
        status: "success",
        data: exercise,
    });
});

export const getExercisesByWorkout = asyncHandler(async (req, res) => {
    const { workoutId } = req.params;

    const exercises = await Exercise.find({ workout: workoutId });

    if (!exercises || exercises.length === 0) {
        throw new AppError("No exercises found for this workout", 404);
    }

    res.status(200).json({
        status: "success",
        data: exercises,
    });
});

export const updateExercise = asyncHandler(async (req, res) => {
    const { exerciseId } = req.params;
    let { title, duration, repetitions, equipment, difficulty, caloriesBurned } = req.body;

    if (typeof equipment === "string") {
        try {
            equipment = JSON.parse(equipment);
        } catch {
            throw new AppError("Invalid JSON format in 'equipment'", 400);
        }
    }

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "exercises/images");
    }

    const exercise = await Exercise.findByIdAndUpdate(
        exerciseId,
        {
            title,
            duration,
            repetitions,
            image: imageUrl || undefined,
            equipment,
            difficulty,
            caloriesBurned,
        },
        { new: true, runValidators: true }
    );

    if (!exercise) {
        throw new AppError("Exercise not found", 404);
    }

    res.status(200).json({
        status: "success",
        data: exercise,
    });
});

export const deleteExercise = asyncHandler(async (req, res) => {
    const { exerciseId } = req.params;

    const exercise = await Exercise.findByIdAndDelete(exerciseId);

    if (!exercise) {
        throw new AppError("Exercise not found", 404);
    }

    res.status(200).json({
        status: "success",
        message: "Exercise deleted successfully",
    });
});
