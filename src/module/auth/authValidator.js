import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().required().trim().min(3),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string().required().trim(),
  gender: Joi.string()
    .required()
    .valid("Male", "Female", "Other"),
  dateOfBirth: Joi.date().required(),
  weight: Joi.number().required(),
  height: Joi.number().required(),
  termsAccepted: Joi.boolean().required().valid(true), // Ensure terms are accepted
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(8).required(),
});
