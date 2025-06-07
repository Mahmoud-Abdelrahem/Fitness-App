import express from "express";
import * as categoryController from "./categoryController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

router.post(
    "/",
    auth.protect,
    upload.single("image"),
    categoryController.createCategory
);

router.get("/", auth.protect, categoryController.getAllCategories);

router.get("/:categoryId", auth.protect, categoryController.getCategoryById);

router.patch(
    "/:categoryId",
    auth.protect,
    upload.single("image"),
    categoryController.updateCategory
);

router.delete("/:categoryId", auth.protect, categoryController.deleteCategory);

export default router;
