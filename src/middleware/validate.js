// validate.js
import AppError from '../utils/AppError.js';

export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);

  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return next(new AppError(errorMessage, 400));
  }

  next();
};

export const parseJsonFields = (fields) => (req, res, next) => {
  for (const field of fields) {
    if (typeof req.body[field] === "string") {
      try {
        req.body[field] = JSON.parse(req.body[field]);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: `Invalid JSON format for '${field}'.`,
        });
      }
    }
  }
  next();
};
