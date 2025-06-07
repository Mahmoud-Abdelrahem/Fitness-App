import express from "express";
import * as activityTrackerController from "./ActivityTrackerController.js";
import auth from "../../middleware/authentication.js";
import {validate} from "../../middleware/validate.js";
import Joi from "joi";

const router = express.Router();

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


router.post(
    "/",
    auth.protect,
    validate(createActivityTrackerSchema),
    activityTrackerController.createActivityTracker
);

router.get("/", auth.protect, activityTrackerController.getActivityTracker);

router.patch(
    "/daily-target",
    auth.protect,
    validate(updateDailyTargetSchema),
    activityTrackerController.updateDailyTarget
);

router.post(
    "/progress",
    auth.protect,
    validate(addDailyProgressSchema),
    activityTrackerController.addDailyProgress
);

router.post(
    "/latest-activity",
    auth.protect,
    validate(addLatestActivitySchema),
    activityTrackerController.addLatestActivity
);

router.delete("/", auth.protect, activityTrackerController.deleteActivityTracker);

export default router;