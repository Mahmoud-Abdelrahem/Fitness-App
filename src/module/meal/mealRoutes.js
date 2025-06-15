import express from "express";
import * as mealController from "./mealController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";
import { parseJsonFields } from "../../middleware/validate.js";

const router = express.Router();

router.post(
    "/",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["nutrition", "dailyMeals", "suggestedCategories"]),
    mealController.createMeal
);

router.get("/", auth.protect, mealController.getAllMeals);

router.get("/:mealId", auth.protect, mealController.getMealById);

router.patch(
    "/:mealId",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["nutrition", "dailyMeals", "suggestedCategories"]),
    mealController.updateMeal
);

router.delete("/:mealId", auth.protect, mealController.deleteMeal);

export default router;