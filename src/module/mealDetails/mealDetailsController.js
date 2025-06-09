import asyncHandler from "express-async-handler";
import MainCategory from "./mealDetailsModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";


export const getAllMainCategories = asyncHandler(async (req, res) => {
    const mainCategories = await MainCategory.find();
    res.status(200).json({ success: true, data: mainCategories });
});

export const getMainCategoryById = asyncHandler(async (req, res) => {
    const { mainCategoryId } = req.params;
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);
    res.status(200).json({ success: true, data: mainCategory });
});

export const createMainCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "mainCategories/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const mainCategory = await MainCategory.create({ name, subcategories: [], image: imageUrl });
    res.status(201).json({ success: true, data: mainCategory });
});

export const updateMainCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId } = req.params;
    const { name } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "mainCategories/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const updatedMainCategory = await MainCategory.findById(mainCategoryId);
    if (!updatedMainCategory) throw new AppError("Main category not found", 404);

    if (name) updatedMainCategory.name = name;
    if (imageUrl) updatedMainCategory.image = imageUrl;

    await updatedMainCategory.save();

    res.status(200).json({ success: true, data: updatedMainCategory });
});

export const deleteMainCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId } = req.params;
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);
    await mainCategory.deleteOne();
    res.status(200).json({ success: true, message: "Main category and all its subcategories and meals deleted" });
});

export const getCategoriesByMainCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId } = req.params;
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);
    res.status(200).json({ success: true, data: mainCategory.subcategories });
});

export const addSubCategoryToMain = asyncHandler(async (req, res) => {
    const { mainCategoryId } = req.params;
    const { name, description } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "subCategories/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);

    const newSub = { name, description, image: imageUrl, meals: [] };
    mainCategory.subcategories.push(newSub);
    await mainCategory.save();

    res.status(201).json({ success: true, data: newSub });
});

export const deleteSubCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId, subCategoryId } = req.params;
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);

    const subCategory = mainCategory.subcategories.id(subCategoryId);
    if (!subCategory) throw new AppError("Subcategory not found", 404);

    subCategory.deleteOne();
    await mainCategory.save();

    res.status(200).json({ success: true, message: "Subcategory and its meals deleted successfully" });
});

export const updateSubCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId, subCategoryId } = req.params;
    const { name, description } = req.body;
    let imageUrl = null;

    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);

    const subCategory = mainCategory.subcategories.id(subCategoryId);
    if (!subCategory) throw new AppError("Subcategory not found", 404);

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "subCategories/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    if (name) subCategory.name = name;
    if (description) subCategory.description = description;
    if (imageUrl) subCategory.image = imageUrl;

    await mainCategory.save();

    res.status(200).json({ success: true, data: subCategory });
});


export const getMealsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const category = await MainCategory.findOne({ "subcategories._id": categoryId }, { "subcategories.$": 1 });
    if (!category || !category.subcategories.length) throw new AppError("Subcategory not found", 404);
    res.status(200).json({ success: true, data: category.subcategories[0].meals });
});

export const filterMealsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { isPopular, isRecommended } = req.query;
    const category = await MainCategory.findOne({ "subcategories._id": categoryId }, { "subcategories.$": 1 });
    if (!category || !category.subcategories.length) throw new AppError("Subcategory not found", 404);

    let meals = category.subcategories[0].meals;

    if (isPopular) meals = meals.filter((meal) => meal.isPopular === (isPopular === "true"));
    if (isRecommended) meals = meals.filter((meal) => meal.isRecommended === (isRecommended === "true"));

    res.status(200).json({ success: true, data: meals });
});

export const addMealToSubCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId, subCategoryId } = req.params;
    const { name, description, calories, difficulty, time, isRecommended, isPopular, nutrition, ingredients, steps } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "meals/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);

    const subCategory = mainCategory.subcategories.id(subCategoryId);
    if (!subCategory) throw new AppError("Subcategory not found", 404);

    const newMeal = { name, description, image: imageUrl, calories, difficulty, time, isRecommended, isPopular, nutrition, ingredients, steps };
    subCategory.meals.push(newMeal);
    await mainCategory.save();

    res.status(201).json({ success: true, data: newMeal });
});

export const updateMealInSubCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId, subCategoryId, mealId } = req.params;
    const { name, description, calories, difficulty, time, isRecommended, isPopular, nutrition, ingredients, steps } = req.body;
    let imageUrl = null;

    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);

    const subCategory = mainCategory.subcategories.id(subCategoryId);
    if (!subCategory) throw new AppError("Subcategory not found", 404);

    const meal = subCategory.meals.id(mealId);
    if (!meal) throw new AppError("Meal not found", 404);

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "meals/images");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    if (name) meal.name = name;
    if (description) meal.description = description;
    if (calories) meal.calories = calories;
    if (difficulty) meal.difficulty = difficulty;
    if (time) meal.time = time;
    if (isRecommended !== undefined) meal.isRecommended = isRecommended;
    if (isPopular !== undefined) meal.isPopular = isPopular;
    if (nutrition) meal.nutrition = nutrition;
    if (ingredients) meal.ingredients = ingredients;
    if (steps) meal.steps = steps;
    if (imageUrl) meal.image = imageUrl;

    await mainCategory.save();

    res.status(200).json({ success: true, data: meal });
});

export const deleteMealFromSubCategory = asyncHandler(async (req, res) => {
    const { mainCategoryId, subCategoryId, mealId } = req.params;
    const mainCategory = await MainCategory.findById(mainCategoryId);
    if (!mainCategory) throw new AppError("Main category not found", 404);

    const subCategory = mainCategory.subcategories.id(subCategoryId);
    if (!subCategory) throw new AppError("Subcategory not found", 404);

    const mealIndex = subCategory.meals.findIndex((meal) => meal._id.toString() === mealId);
    if (mealIndex === -1) throw new AppError("Meal not found", 404);

    subCategory.meals.splice(mealIndex, 1);
    await mainCategory.save();

    res.status(200).json({ success: true, message: "Meal deleted successfully" });
});