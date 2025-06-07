import express from "express";
import * as activityTrackerController from "./ActivityTrackerController.js";
import auth from "../../middleware/authentication.js";
import {validate} from "../../middleware/validate.js";
import Joi from "joi";

const router = express.Router();

// Validation schemas
const createActivityTrackerSchema = Joi.object({
    dailyTarget: Joi.object({
        waterIntake: Joi.number().required(),
        footSteps: Joi.number().required(),
    }).required(),
});

const updateDailyTargetSchema = Joi.object({
    waterIntake: Joi.number().required(),
    footSteps: Joi.number().required(),
});

const addDailyProgressSchema = Joi.object({
    waterIntake: Joi.number().required(),
    footSteps: Joi.number().required(),
});

const addLatestActivitySchema = Joi.object({
    activityType: Joi.string().valid("water", "steps", "snack").required(),
    description: Joi.string().required(),
});

// Routes

// إنشاء سجل جديد للنشاط
router.post(
    "/",
    auth.protect,
    validate(createActivityTrackerSchema),
    activityTrackerController.createActivityTracker
);

// الحصول على بيانات النشاط للمستخدم
router.get("/", auth.protect, activityTrackerController.getActivityTracker);

// تحديث الأهداف اليومية
router.patch(
    "/daily-target",
    auth.protect,
    validate(updateDailyTargetSchema),
    activityTrackerController.updateDailyTarget
);

// إضافة تقدم يومي جديد
router.post(
    "/progress",
    auth.protect,
    validate(addDailyProgressSchema),
    activityTrackerController.addDailyProgress
);

// إضافة نشاط جديد إلى قائمة الأنشطة الأخيرة
router.post(
    "/latest-activity",
    auth.protect,
    validate(addLatestActivitySchema),
    activityTrackerController.addLatestActivity
);

// حذف سجل النشاط للمستخدم
router.delete("/", auth.protect, activityTrackerController.deleteActivityTracker);

export default router;