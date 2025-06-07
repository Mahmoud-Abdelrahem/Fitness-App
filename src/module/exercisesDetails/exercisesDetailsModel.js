import mongoose from "mongoose";

const exerciseDetailsSchema = new mongoose.Schema(
    {
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exercise",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        totalCaloriesBurned: {
            type: Number, // إجمالي السعرات الحرارية المحروقة
            required: true,
        },
        steps: [
            {
                stepNumber: {
                    type: Number,
                    required: true,
                },
                title: {
                    type: String, // عنوان الخطوة
                    required: true,
                },
                instruction: {
                    type: String, // وصف الخطوة
                    required: true,
                },
                caloriesBurned: {
                    type: Number, // السعرات الحرارية المحروقة لكل خطوة
                    required: true,
                },
            },
        ],
        customRepetitions: [
            {
                caloriesBurned: {
                    type: Number,
                    required: true,
                },
                repetitions: {
                    type: Number,
                    required: true,
                },
            },
        ],
        video: {
            type: String, // رابط الفيديو
            required: false,
        },
    },
    {
        timestamps: true, // يضيف createdAt و updatedAt تلقائيًا
    }
);

const ExerciseDetails = mongoose.model("ExerciseDetails", exerciseDetailsSchema);
export default ExerciseDetails;