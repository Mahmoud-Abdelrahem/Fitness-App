import express from "express";
import * as workoutTrackerController from "./workoutTrackerController.js";
import auth from "../../middleware/authentication.js";
import {validate} from "../../middleware/validate.js";
import upload from "../../middleware/upload.js";
import Joi from "joi";

// Middleware لتحويل JSON strings إلى مصفوفات
const parseJsonFields = (req, res, next) => {
    try {
        if (req.body.upcomingWorkouts && typeof req.body.upcomingWorkouts === "string") {
            req.body.upcomingWorkouts = JSON.parse(req.body.upcomingWorkouts);
        }
        if (req.body.availableWorkouts && typeof req.body.availableWorkouts === "string") {
            req.body.availableWorkouts = JSON.parse(req.body.availableWorkouts);
        }
        if (req.body.weeklyProgress && typeof req.body.weeklyProgress === "string") {
            req.body.weeklyProgress = JSON.parse(req.body.weeklyProgress);
        }
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: {
                message: "Invalid JSON format in one of the fields",
                details: error.message,
            },
        });
    }
};


const router = express.Router();

// Validation schemas
const createWorkoutTrackerSchema = Joi.object({
    upcomingWorkouts: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            date: Joi.date().required(),
            notificationEnabled: Joi.boolean().default(true),
        })
    ),
    availableWorkouts: Joi.array().items(
        Joi.object({
            title: Joi.string().required(),
            exercises: Joi.number().required(),
            duration: Joi.number().required(),
            image: Joi.string().uri(),
        })
    ),
    weeklyProgress: Joi.array().items(
        Joi.object({
            day: Joi.string().valid("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat").required(),
            progress: Joi.number().min(0).max(100).required(),
        })
    ),
});

const addUpcomingWorkoutSchema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    notificationEnabled: Joi.boolean().default(true),
});

const updateWeeklyProgressSchema = Joi.object({
    day: Joi.string().valid("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat").required(),
    progress: Joi.number().min(0).max(100).required(),
});

const addCompletedWorkoutSchema = Joi.object({
    title: Joi.string().required(),
    date: Joi.date().required(),
    duration: Joi.number().required(),
    caloriesBurned: Joi.number().required(),
});

// Routes

// إنشاء سجل جديد للمستخدم
router.post(
    "/",
    auth.protect,
    upload.single("image"),
    parseJsonFields,
    validate(createWorkoutTrackerSchema),
    workoutTrackerController.createWorkoutTracker
);

// الحصول على بيانات التمارين للمستخدم
router.get("/", auth.protect, workoutTrackerController.getWorkoutTracker);

// إضافة تمرين جديد إلى التدريبات القادمة
router.post(
    "/upcoming",
    auth.protect,
    upload.single("image"), // Middleware لتحميل الصورة
    validate(addUpcomingWorkoutSchema),
    workoutTrackerController.addUpcomingWorkout
);

// تحديث تقدم أسبوعي
router.patch(
    "/progress",
    auth.protect,
    validate(updateWeeklyProgressSchema),
    workoutTrackerController.updateWeeklyProgress
);

// إضافة تمرين مكتمل
router.post(
    "/completed",
    auth.protect,
    upload.single("image"), // Middleware لتحميل الصورة
    validate(addCompletedWorkoutSchema),
    workoutTrackerController.addCompletedWorkout
);

// حذف تمرين من التدريبات القادمة 
router.delete(
    "/upcoming/:workoutId",
    auth.protect,
    workoutTrackerController.deleteUpcomingWorkout
);

export default router;