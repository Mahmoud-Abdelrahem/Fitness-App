import express from "express";
import * as compareController from "./compareController.js";
import auth from "../../middleware/authentication.js";
import upload from "../../middleware/upload.js";

const router = express.Router();

router.post("/gallery/upload", auth.protect, upload.single("image"), compareController.uploadPhotoToGallery);

router.post("/gallerycompare", auth.protect, compareController.comparePhotos);

router.get("/gallery", auth.protect, compareController.getGalleryPhotos);
router.get("/compareresult", auth.protect, compareController.getLastComparisonResult);
router.delete("/gallery/:photoId", auth.protect, compareController.deleteGalleryPhoto);
router.put(
    "/gallery/:photoId",
    auth.protect,
    upload.single("image"),
    compareController.updateGalleryPhoto
);

export default router;
