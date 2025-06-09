import mongoose from "mongoose";


const nutritionSchema = new mongoose.Schema({
    calories: { type: Number, required: true },
    fats: { type: Number, required: true }, 
    proteins: { type: Number, required: true },
});
const ingredientSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    quantity: { type: String, required: true },
    image: { type: String },
});
const stepSchema = new mongoose.Schema({
    stepNumber: { type: Number, required: true }, 
    instruction: { type: String, required: true }, 
});
const mealSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    calories: { type: Number, required: true },
    difficulty: { type: String, required: true },
    time: { type: String, required: true },
    isRecommended: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    nutrition: nutritionSchema,
    ingredients: [ingredientSchema],
    steps: [stepSchema],
});

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    meals: [mealSchema],
});

const mainCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    subcategories: [subCategorySchema],
}, { timestamps: true });

const MainCategory = mongoose.model("MainCategory", mainCategorySchema);
export default MainCategory;