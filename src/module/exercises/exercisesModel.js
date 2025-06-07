import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
    {
        workout: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WorkoutTracker",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        duration: {
            type: Number, // مدة التمرين بالدقائق
            required: true,
        },
        repetitions: {
            type: Number, // عدد التكرارات
            required: false,
        },
        image: {
            type: String, // رابط صورة التمرين
            required: false,
        },
        equipment: [
            {
                name: {
                    type: String,
                    required: true,
                },
                image: {
                    type: String, // رابط صورة الأداة
                    required: false,
                },
            },
        ],
        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
            required: true,
        },
        caloriesBurned: {
            type: Number, // السعرات الحرارية المحروقة
            required: true,
        },
    },
    {
        timestamps: true, // يضيف createdAt و updatedAt تلقائيًا
    }
);

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;