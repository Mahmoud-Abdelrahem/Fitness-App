import express from "express";
import * as auhtController from "./authController.js";
import {validate} from "../../middleware/validate.js";
import {
  createUserSchema,
  loginSchema,
} from "./authValidator.js";
import auth from "../../middleware/authentication.js";
import passport from "passport";
import { googleCallback } from "./authController.js";

const router = express.Router();

router
  .route("/register")
  .post(validate(createUserSchema), auhtController.register);

router.post(
  "/create-user",
  auth.protect,
  validate(createUserSchema),
  auhtController.createUser
);

router.route("/login").post(validate(loginSchema), auhtController.login);

router.route("/logout").post(auhtController.logout);

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
