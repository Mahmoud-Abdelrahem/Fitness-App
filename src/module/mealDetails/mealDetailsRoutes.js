import express from "express";
import * as mealDetailsController from "./mealDetailsController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";
import { validate, parseJsonFields } from "../../middleware/validate.js";
import { mainCategorySchema, subCategorySchema, mealSchema } from "./mealDetailsValidation.js";

const router = express.Router();


router.get("/main", auth.protect, mealDetailsController.getAllMainCategories);
router.get("/main/:mainCategoryId", auth.protect, mealDetailsController.getMainCategoryById);
router.post(
    "/main",
    auth.protect,
    upload.single("image"),
    validate(mainCategorySchema),
    mealDetailsController.createMainCategory
);

router.put(
    "/main/:mainCategoryId",
    auth.protect,
    upload.single("image"),
    validate(mainCategorySchema),
    mealDetailsController.updateMainCategory
);
router.delete("/main/:mainCategoryId", auth.protect, mealDetailsController.deleteMainCategory);


router.get("/main/:mainCategoryId/subcategories", auth.protect, mealDetailsController.getCategoriesByMainCategory);
router.post(
    "/main/:mainCategoryId/subcategories",
    auth.protect,
    upload.single("image"),
    validate(subCategorySchema), 
    mealDetailsController.addSubCategoryToMain
);
router.put(
    "/main/:mainCategoryId/sub/:subCategoryId",
    auth.protect,
    upload.single("image"),
    validate(subCategorySchema), 
    mealDetailsController.updateSubCategory
);
router.delete("/main/:mainCategoryId/sub/:subCategoryId", auth.protect, mealDetailsController.deleteSubCategory);


router.get("/sub/:categoryId/meals", auth.protect, mealDetailsController.getMealsByCategory);
router.get("/sub/:categoryId/meals/filter", auth.protect, mealDetailsController.filterMealsByCategory);
router.post(
    "/main/:mainCategoryId/sub/:subCategoryId/meals",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["nutrition", "ingredients", "steps"]),
    validate(mealSchema), 
    mealDetailsController.addMealToSubCategory
);
router.put(
    "/main/:mainCategoryId/sub/:subCategoryId/meals/:mealId",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["nutrition", "ingredients", "steps"]), 
    validate(mealSchema), 
    mealDetailsController.updateMealInSubCategory
);
router.delete("/main/:mainCategoryId/sub/:subCategoryId/meals/:mealId", auth.protect, mealDetailsController.deleteMealFromSubCategory);

export default router;