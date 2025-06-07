import express from "express";
import * as exercisesDetailsController from "./exercisesDetailsController.js";
import auth from "../../middleware/authentication.js";
import { validate, parseJsonFields } from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";
import Joi from "joi";

const router = express.Router();

const createExerciseDetailsSchema = Joi.object({
  exercise: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(), 
  totalCaloriesBurned: Joi.number().required(),
  steps: Joi.array().items(
    Joi.object({
      stepNumber: Joi.number().required(),
      title: Joi.string().required(),
      instruction: Joi.string().required(),
      caloriesBurned: Joi.number().required(),
    })
  ).required(),
  customRepetitions: Joi.array().items(
    Joi.object({
      repetitions: Joi.number().required(),
      caloriesBurned: Joi.number().required(),
    })
  ).required(),
});


const updateExerciseDetailsSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  totalCaloriesBurned: Joi.number().optional(),
  steps: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(
      Joi.object({
        stepNumber: Joi.number().required(),
        title: Joi.string().required(),
        instruction: Joi.string().required(),
        caloriesBurned: Joi.number().required(),
      })
    )
  ).optional(),
  customRepetitions: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(
      Joi.object({
        repetitions: Joi.number().required(),
        caloriesBurned: Joi.number().required(),
      })
    )
  ).optional(),
});


// Routes

// إنشاء تفاصيل تمرين جديد
router.post(
  "/",
  auth.protect,
  upload.single("video"),
  parseJsonFields(["steps", "customRepetitions"]),
  validate(createExerciseDetailsSchema),
  exercisesDetailsController.createExerciseDetails
);


// الحصول على تفاصيل تمرين معين
router.get("/:exerciseId", auth.protect, exercisesDetailsController.getExerciseDetails);

// تحديث تفاصيل تمرين
router.patch(
  "/:exerciseId",
  auth.protect,
  upload.single("video"), // Middleware لتحميل الفيديو
  parseJsonFields(["steps", "customRepetitions"]),
  validate(updateExerciseDetailsSchema),
  exercisesDetailsController.updateExerciseDetails
);

// حذف تفاصيل تمرين
router.delete("/:exerciseId", auth.protect, exercisesDetailsController.deleteExerciseDetails);

export default router;