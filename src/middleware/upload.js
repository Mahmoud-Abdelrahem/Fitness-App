// middleware/upload.js
import multer from "multer";

// استخدم الذاكرة بدل التخزين على الهارد
const storage = multer.memoryStorage();

// تعديل الفلتر لدعم الصور والفيديوهات
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "video/mp4", "video/mpeg"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only image and video files are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter });

export default upload;
