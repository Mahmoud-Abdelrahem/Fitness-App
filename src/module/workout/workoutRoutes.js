import express from "express";
import * as workoutController from "./workoutController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";


const router = express.Router();


router.get("/", auth.protect, workoutController.getAllWorkouts);

router.get("/:workoutId", auth.protect, workoutController.getWorkoutById);

router.post(
    "/",
    auth.protect,
    upload.single("image"),
    workoutController.createWorkout
);

router.put(
    "/:workoutId",
    auth.protect,
    upload.single("image"),
    workoutController.updateWorkout
);

router.delete("/:workoutId", auth.protect, workoutController.deleteWorkout);

export default router;