import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number, required: true },
    sugar: { type: Number, required: true },
});

const dailyMealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    time: { type: String, required: true },
    image: { type: String },
});

const suggestedCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    totalFoods: { type: Number, required: true },
    mainCategory: { type: mongoose.Schema.Types.ObjectId, ref: "MainCategory", required: true },
});

const mealSchema = new mongoose.Schema(
    {
        nutrition: nutritionSchema,
        dailyMeals: [dailyMealSchema],
        suggestedCategories: [suggestedCategorySchema],
    },
    { timestamps: true }
);

const Meal = mongoose.model("Meal", mealSchema);
export default Meal;