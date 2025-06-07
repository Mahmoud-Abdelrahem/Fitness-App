import Joi from "joi";

export const userValidationSchema = Joi.object({
  name: Joi.string().required().trim().min(3),
  email: Joi.string().email().required().trim(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string().required().trim(),
  gender: Joi.string()
    .required()
    .valid("Male", "Female", "Other"),
  dateOfBirth: Joi.date().required(),
  weight: Joi.number().required(),
  height: Joi.number().required(),
  termsAccepted: Joi.boolean().required().valid(true),
});

export const userUpdateValidationSchema = Joi.object({
  name: Joi.string().trim().min(3).optional(), 
  email: Joi.string().email().trim().optional(), 
  password: Joi.string().min(8).optional(), 
  phoneNumber: Joi.string().trim().optional(), 
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional(), 
  dateOfBirth: Joi.date().optional(), 
  weight: Joi.number().optional(), 
  height: Joi.number().optional(), 
  termsAccepted: Joi.boolean().valid(true).forbidden(),
});
