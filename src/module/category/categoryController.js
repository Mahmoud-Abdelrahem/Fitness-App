import asyncHandler from "express-async-handler";
import Category from "./categoryModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createCategory = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "categories/images");
    }

    const category = await Category.create({
        name,
        description,
        image: imageUrl,
    });

    res.status(201).json({
        success: true,
        data: category,
    });
});

export const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        data: categories,
    });
});

export const getCategoryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    res.status(200).json({
        success: true,
        data: category,
    });
});

export const updateCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { name, description } = req.body;

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "categories/images");
    }

    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
            name,
            description,
            ...(imageUrl && { image: imageUrl }),
        },
        { new: true, runValidators: true }
    );

    if (!updatedCategory) {
        throw new AppError("Category not found", 404);
    }

    res.status(200).json({
        success: true,
        data: updatedCategory,
    });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
        throw new AppError("Category not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
    });
});
