import express from "express";
import * as productController from "./productController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

router.post(
    "/",
    auth.protect,
    upload.single("image"),
    productController.createProduct
);

router.get("/search", auth.protect, productController.searchProducts);

router.get("/", auth.protect, productController.getAllProducts);

router.get("/category/:categoryId", auth.protect, productController.getProductsByCategory);

router.get("/:productId", auth.protect, productController.getProductById);

router.patch(
    "/:productId",
    auth.protect,
    upload.single("image"),
    productController.updateProduct
);

router.delete("/:productId", auth.protect, productController.deleteProduct);

export default router;