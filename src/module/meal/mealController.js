import asyncHandler from "express-async-handler";
import Meal from "./mealModel.js";
import MainCategory from "../mealDetails/mealDetailsModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createMeal = asyncHandler(async (req, res) => {
    const { nutrition, dailyMeals, suggestedCategories } = req.body;

    // التحقق من أن جميع mainCategoryId صالحة
    if (suggestedCategories) {
        for (const category of suggestedCategories) {
            const mainCategoryExists = await MainCategory.findById(category.mainCategory);
            if (!mainCategoryExists) {
                throw new AppError(`MainCategory with ID ${category.mainCategory} not found`, 404);
            }
        }
    }

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "meals/images");
    }

    const meal = await Meal.create({
        nutrition,
        dailyMeals,
        suggestedCategories,
        image: imageUrl,
    });

    res.status(201).json({
        success: true,
        data: meal,
    });
});

export const getAllMeals = asyncHandler(async (req, res) => {
    const meals = await Meal.find();
    res.status(200).json({
        success: true,
        data: meals,
    });
});

export const getMealById = asyncHandler(async (req, res) => {
    const { mealId } = req.params;

    const meal = await Meal.findById(mealId);

    if (!meal) {
        throw new AppError("Meal not found", 404);
    }

    res.status(200).json({
        success: true,
        data: meal,
    });
});

export const updateMeal = asyncHandler(async (req, res) => {
    const { mealId } = req.params;
    const { nutrition, dailyMeals, suggestedCategories } = req.body;

    // التحقق من أن جميع mainCategoryId صالحة
    if (suggestedCategories) {
        for (const category of suggestedCategories) {
            const mainCategoryExists = await MainCategory.findById(category.mainCategory);
            if (!mainCategoryExists) {
                throw new AppError(`MainCategory with ID ${category.mainCategory} not found`, 404);
            }
        }
    }

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "meals/images");
    }

    const updatedMeal = await Meal.findByIdAndUpdate(
        mealId,
        {
            nutrition,
            dailyMeals,
            suggestedCategories,
            ...(imageUrl && { image: imageUrl }),
        },
        { new: true, runValidators: true }
    );

    if (!updatedMeal) {
        throw new AppError("Meal not found", 404);
    }

    res.status(200).json({
        success: true,
        data: updatedMeal,
    });
});

export const deleteMeal = asyncHandler(async (req, res) => {
    const { mealId } = req.params;

    const meal = await Meal.findByIdAndDelete(mealId);

    if (!meal) {
        throw new AppError("Meal not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Meal deleted successfully",
    });
});