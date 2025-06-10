import asyncHandler from "express-async-handler";
import Compare from "./compareModel.js";
import AppError from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

export const uploadPhotoToGallery = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { weight, facing, date } = req.body;
    let imageUrl = null;

    if (req.file) {
        try {
            imageUrl = await uploadToCloudinary(req.file.buffer, "gallery/photos");
        } catch (error) {
            throw new AppError("Failed to upload image to Cloudinary", 500);
        }
    }

    const photo = {
        url: imageUrl,
        weight: weight ? Number(weight) : undefined,
        facing,
        date: date ? new Date(date) : new Date(),
    };

    let compare = await Compare.findOne({ userId });

    if (!compare) {
        compare = await Compare.create({
            userId,
            gallery: [photo],
        });
    } else {
        compare.gallery.push(photo);
        await compare.save();
    }

    res.status(201).json({ success: true, data: compare });
});

export const comparePhotos = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { beforePhotoId, afterPhotoId } = req.body;
    if (beforePhotoId === afterPhotoId) {
        throw new AppError("Cannot compare the same photo", 400);
    }

    const compare = await Compare.findOne({ userId });
    if (!compare) throw new AppError("Gallery not found for this user", 404);

    const beforePhoto = compare.gallery.id(beforePhotoId);
    const afterPhoto = compare.gallery.id(afterPhotoId);

    if (!beforePhoto || !afterPhoto) throw new AppError("One or both photos not found", 404);

    const weightDifference = beforePhoto.weight && afterPhoto.weight
        ? beforePhoto.weight - afterPhoto.weight
        : null;

    const progressPercentage = weightDifference
        ? ((beforePhoto.weight - afterPhoto.weight) / beforePhoto.weight) * 100
        : null;

    const dateDifference = beforePhoto.date && afterPhoto.date
        ? Math.ceil((new Date(afterPhoto.date) - new Date(beforePhoto.date)) / (1000 * 60 * 60 * 24))
        : null;

    compare.comparison = {
        beforePhoto,
        afterPhoto,
        progressPercentage,
        weightDifference,
        dateDifference,
    };

    await compare.save();

    res.status(200).json({ success: true, data: compare.comparison });
});

export const getGalleryPhotos = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const compare = await Compare.findOne({ userId });
    if (!compare) throw new AppError("Gallery not found for this user", 404);

    const gallery = compare.gallery.map((photo) => ({
        id: photo._id,
        url: photo.url,
        weight: photo.weight,
        facing: photo.facing,
        uploadDate: photo.uploadDate,
        date: photo.date,
    }));

    res.status(200).json({ success: true, data: gallery });
});

export const getLastComparisonResult = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const compare = await Compare.findOne({ userId });
    if (!compare || !compare.comparison || !compare.comparison.beforePhoto || !compare.comparison.afterPhoto) {
        throw new AppError("No comparison result found", 404);
    }

    const result = {
        before: {
            url: compare.comparison.beforePhoto.url,
            weight: compare.comparison.beforePhoto.weight,
            date: compare.comparison.beforePhoto.date,
        },
        after: {
            url: compare.comparison.afterPhoto.url,
            weight: compare.comparison.afterPhoto.weight,
            date: compare.comparison.afterPhoto.date,
        },
        weightDifference: compare.comparison.weightDifference,
        progressPercentage: compare.comparison.progressPercentage,
        dateDifference: compare.comparison.dateDifference,
    };

    res.status(200).json({ success: true, data: result });
});

export const deleteGalleryPhoto = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { photoId } = req.params;

    const compare = await Compare.findOne({ userId });
    if (!compare) throw new AppError("Gallery not found", 404);

    const photo = compare.gallery.find((img) => img._id.toString() === photoId);
    if (!photo) throw new AppError("Photo not found in gallery", 404);

    if (photo.public_id) {
        await cloudinary.uploader.destroy(photo.public_id);
    }

    compare.gallery = compare.gallery.filter((img) => img._id.toString() !== photoId);
    await compare.save();

    res.status(200).json({ success: true, message: "Photo deleted successfully" });
});

export const updateGalleryPhoto = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { photoId } = req.params;
    const { weight, date, facing } = req.body;

    const compare = await Compare.findOne({ userId });
    if (!compare) throw new AppError("Gallery not found", 404);

    const photo = compare.gallery.find((img) => img._id.toString() === photoId);
    if (!photo) throw new AppError("Photo not found in gallery", 404);

    if (req.file) {
        try {
            const newImageUrl = await uploadToCloudinary(req.file.buffer, "gallery/photos");

            if (photo.public_id) await cloudinary.uploader.destroy(photo.public_id);

            photo.url = newImageUrl;
        } catch (error) {
            throw new AppError("Failed to upload new image to Cloudinary", 500);
        }
    }

    if (weight !== undefined) photo.weight = Number(weight);
    if (date !== undefined) photo.date = new Date(date);
    if (facing !== undefined) photo.facing = facing;

    await compare.save();

    res.status(200).json({ success: true, message: "Photo updated successfully", photo });
});

