import express from "express";
import * as userController from "./userController.js";
import {validate} from "../../middleware/validate.js";
import { userUpdateValidationSchema } from "./userValidator.js";
import auth from "../../middleware/authentication.js";
import { createUserSchema } from "../auth/authValidator.js";
import * as authController from "../auth/authController.js";

const router = express.Router();

router
  .route("/")
  .post(
    validate(createUserSchema),
    authController.createUser
  )
  .get(auth.protect, userController.getAllUsers);

router
  .route("/:userId")
  .get(auth.protect, userController.getUserById)
  .put(
    auth.protect,
    validate(userUpdateValidationSchema),
    userController.updateUser
  )
  .delete(auth.protect, userController.deleteUser);

router.patch(
  "/change-password/:userId",
  auth.protect,
  userController.changeUserPassword
);

export default router;
