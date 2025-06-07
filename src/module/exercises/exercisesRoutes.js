import express from "express";
import * as exercisesController from "./exercisesController.js";
import auth from "../../middleware/authentication.js";
import {validate , parseJsonFields } from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";
import Joi from "joi";

const router = express.Router();

const createExerciseSchema = Joi.object({
    workout: Joi.string().required(),
    title: Joi.string().required(),
    duration: Joi.number().required(),
    repetitions: Joi.number().optional(),
    equipment: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            image: Joi.string().uri().optional(),
        })
    ),
    difficulty: Joi.string().valid("beginner", "intermediate", "advanced").required(),
    caloriesBurned: Joi.number().required(),
});

const updateExerciseSchema = Joi.object({
    title: Joi.string().optional(),
    duration: Joi.number().optional(),
    repetitions: Joi.number().optional(),
    equipment: Joi.array().items(
        Joi.object({
            name: Joi.string().required(),
            image: Joi.string().uri().optional(),
        })
    ),
    difficulty: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
    caloriesBurned: Joi.number().optional(),
});


router.post(
    "/",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["equipment"]),
    validate(createExerciseSchema),
    exercisesController.createExercise
);

router.get("/:workoutId", auth.protect, exercisesController.getExercisesByWorkout);

router.patch(
    "/:exerciseId",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["equipment"]),
    validate(updateExerciseSchema),
    exercisesController.updateExercise
);

router.delete("/:exerciseId", auth.protect, exercisesController.deleteExercise);

export default router;