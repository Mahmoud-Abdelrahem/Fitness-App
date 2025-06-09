import Joi from "joi";

// فاليديشن للفئات الرئيسية
export const mainCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "The name field is required.",
    }),
});

// فاليديشن للفئات الداخلية
export const subCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "The name field is required.",
    }),
    description: Joi.string().optional(),
});

// فاليديشن للوجبات
export const mealSchema = Joi.object({
    name: Joi.string().required().messages({
        "string.empty": "The name field is required.",
    }),
    description: Joi.string().optional(),
    calories: Joi.number().required().messages({
        "number.base": "Calories must be a number.",
    }),
    difficulty: Joi.string().valid("Easy", "Medium", "Hard").required().messages({
        "any.only": "Difficulty must be one of Easy, Medium, or Hard.",
    }),
    time: Joi.string().required().messages({
        "string.empty": "The time field is required.",
    }),
    isRecommended: Joi.boolean().optional(),
    isPopular: Joi.boolean().optional(),
    nutrition: Joi.object({
        calories: Joi.number().required(),
        fats: Joi.number().required(),
        proteins: Joi.number().required(),
    }).required(),
    ingredients: Joi.array()
        .items(
            Joi.object({
                name: Joi.string().required(),
                quantity: Joi.string().required(),
                image: Joi.string().optional(),
            })
        )
        .required(),
    steps: Joi.array()
        .items(
            Joi.object({
                stepNumber: Joi.number().required(),
                instruction: Joi.string().required(),
            })
        )
        .required(),
});