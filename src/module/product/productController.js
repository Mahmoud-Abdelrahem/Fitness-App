import asyncHandler from "express-async-handler";
import Product from "./productModel.js";
import Category from "../category/categoryModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const createProduct = asyncHandler(async (req, res) => {
    const { name, category, price, description } = req.body;

    let imageUrl = null;

    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "products/images");
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
        throw new AppError("Category not found", 404);
    }

    const product = await Product.create({
        name,
        category,
        price,
        description,
        image: imageUrl,
    });

    res.status(201).json({
        success: true,
        data: product,
    });
});

export const getAllProducts = asyncHandler(async (req, res) => {
    const products = await Product.find().populate("category");
    res.status(200).json({
        success: true,
        data: products,
    });
});

export const getProductsByCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    const products = await Product.find({ category: categoryId }).populate("category");
    if (!products.length) {
        throw new AppError("No products found for this category", 404);
    }

    res.status(200).json({
        success: true,
        data: products,
    });
});

export const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId).populate("category");
    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json({
        success: true,
        data: product,
    });
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const { name, category, price, description } = req.body;

    let imageUrl = null;

    // رفع صورة جديدة إلى Cloudinary إذا تم توفيرها
    if (req.file) {
        imageUrl = await uploadToCloudinary(req.file.buffer, "products/images");
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name,
            category,
            price,
            description,
            ...(imageUrl && { image: imageUrl }),
        },
        { new: true, runValidators: true }
    );

    if (!updatedProduct) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json({
        success: true,
        data: updatedProduct,
    });
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
        throw new AppError("Product not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

export const searchProducts = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if (!query) {
        res.status(400).json({ success: false, message: "Search query is required" });
        return;
    }

    const products = await Product.find({
        name: { $regex: query, $options: "i" }, 
    }).populate("category");

    res.status(200).json({
        success: true,
        data: products,
    });
});