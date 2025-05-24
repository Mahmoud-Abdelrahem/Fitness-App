import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer, folder = "notifications/icons") => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        stream.end(buffer);
    });
};
