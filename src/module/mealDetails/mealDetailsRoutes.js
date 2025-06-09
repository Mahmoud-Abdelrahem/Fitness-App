import express from "express";
import * as mealDetailsController from "./mealDetailsController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";
import { validate, parseJsonFields } from "../../middleware/validate.js";
import { mainCategorySchema, subCategorySchema, mealSchema } from "./mealDetailsValidation.js";

const router = express.Router();

/** ==========================
 *  Main Categories Routes
 * ========================== */

// الحصول على جميع الفئات الرئيسية
router.get("/main", auth.protect, mealDetailsController.getAllMainCategories);

// الحصول على فئة رئيسية معينة
router.get("/main/:mainCategoryId", auth.protect, mealDetailsController.getMainCategoryById);

// إنشاء فئة رئيسية جديدة
router.post(
    "/main",
    auth.protect,
    upload.single("image"),
    validate(mainCategorySchema), // التحقق من البيانات باستخدام الفاليديشن
    mealDetailsController.createMainCategory
);

// تحديث فئة رئيسية
router.put(
    "/main/:mainCategoryId",
    auth.protect,
    upload.single("image"),
    validate(mainCategorySchema), // التحقق من البيانات باستخدام الفاليديشن
    mealDetailsController.updateMainCategory
);

// حذف فئة رئيسية
router.delete("/main/:mainCategoryId", auth.protect, mealDetailsController.deleteMainCategory);

/** ==========================
 *  Subcategories Routes
 * ========================== */

// الحصول على الفئات الداخلية داخل فئة رئيسية معينة
router.get("/main/:mainCategoryId/subcategories", auth.protect, mealDetailsController.getCategoriesByMainCategory);

// إضافة فئة داخلية جديدة إلى فئة رئيسية
router.post(
    "/main/:mainCategoryId/subcategories",
    auth.protect,
    upload.single("image"),
    validate(subCategorySchema), // التحقق من البيانات باستخدام الفاليديشن
    mealDetailsController.addSubCategoryToMain
);

// تحديث فئة داخلية
router.put(
    "/main/:mainCategoryId/sub/:subCategoryId",
    auth.protect,
    upload.single("image"),
    validate(subCategorySchema), // التحقق من البيانات باستخدام الفاليديشن
    mealDetailsController.updateSubCategory
);

// حذف فئة داخلية
router.delete("/main/:mainCategoryId/sub/:subCategoryId", auth.protect, mealDetailsController.deleteSubCategory);

/** ==========================
 *  Meals Routes
 * ========================== */

// الحصول على جميع الوجبات داخل فئة داخلية معينة
router.get("/sub/:categoryId/meals", auth.protect, mealDetailsController.getMealsByCategory);

// فلترة الوجبات داخل فئة داخلية معينة
router.get("/sub/:categoryId/meals/filter", auth.protect, mealDetailsController.filterMealsByCategory);

// إضافة وجبة جديدة إلى فئة داخلية
router.post(
    "/main/:mainCategoryId/sub/:subCategoryId/meals",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["nutrition", "ingredients", "steps"]), // تحويل الحقول النصية إلى JSON
    validate(mealSchema), // التحقق من البيانات باستخدام الفاليديشن
    mealDetailsController.addMealToSubCategory
);

// تحديث وجبة داخل فئة داخلية
router.put(
    "/main/:mainCategoryId/sub/:subCategoryId/meals/:mealId",
    auth.protect,
    upload.single("image"),
    parseJsonFields(["nutrition", "ingredients", "steps"]), // تحويل الحقول النصية إلى JSON
    validate(mealSchema), // التحقق من البيانات باستخدام الفاليديشن
    mealDetailsController.updateMealInSubCategory
);

// حذف وجبة من فئة داخلية
router.delete("/main/:mainCategoryId/sub/:subCategoryId/meals/:mealId", auth.protect, mealDetailsController.deleteMealFromSubCategory);

export default router;