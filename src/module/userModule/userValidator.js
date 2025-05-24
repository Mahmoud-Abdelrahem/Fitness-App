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
  name: Joi.string().trim().min(3).optional(), // يمكن تحديث الاسم
  email: Joi.string().email().trim().optional(), // يمكن تحديث البريد الإلكتروني
  password: Joi.string().min(8).optional(), // يمكن تحديث كلمة المرور
  phoneNumber: Joi.string().trim().optional(), // يمكن تحديث رقم الهاتف
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional(), // يمكن تحديث النوع
  dateOfBirth: Joi.date().optional(), // يمكن تحديث تاريخ الميلاد
  weight: Joi.number().optional(), // يمكن تحديث الوزن
  height: Joi.number().optional(), // يمكن تحديث الطول
  termsAccepted: Joi.boolean().valid(true).forbidden(), // لا يمكن تحديث قبول الشروط
});
