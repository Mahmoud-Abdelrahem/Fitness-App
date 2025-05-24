import express from "express";
import * as auhtController from "./authController.js";
import validate from "../../middleware/validate.js";
import {
  createUserSchema,
  loginSchema,
} from "./authValidator.js";
import auth from "../../middleware/authentication.js";
import passport from "passport";
import { googleCallback } from "./authController.js";

const router = express.Router();

// تسجيل مستخدم جديد
router
  .route("/register")
  .post(validate(createUserSchema), auhtController.register);

// إنشاء مستخدم بواسطة مسؤول
router.post(
  "/create-user",
  auth.protect,
  validate(createUserSchema),
  auhtController.createUser
);

// تسجيل الدخول
router.route("/login").post(validate(loginSchema), auhtController.login);

// تسجيل الخروج
router.route("/logout").post(auhtController.logout);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleCallback
);

export default router;
