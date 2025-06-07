import express from "express";
import * as paymentController from "./paymentController.js";
import auth from "../../middleware/authentication.js";

const router = express.Router();

// إنشاء Payment Intent
router.post("/create-payment-intent", auth.protect, paymentController.createPaymentIntent);

// تأكيد الدفع
router.post("/confirm-payment", auth.protect, paymentController.confirmPayment);

export default router;
