import asyncHandler from "express-async-handler";
import stripe from "../../utils/stripe.js";

// إنشاء Payment Intent باستخدام Stripe
export const createPaymentIntent = asyncHandler(async (req, res) => {
    const { amount, currency = "usd", metadata } = req.body;

    if (!amount) {
        res.status(400).json({ success: false, message: "Amount is required" });
        return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // تحويل المبلغ إلى سنتات
        currency,
        payment_method_types: ["card"],
        metadata: metadata || {}, // بيانات إضافية يمكن إرسالها
    });

    res.status(200).json({
        success: true,
        clientSecret: paymentIntent.client_secret,
    });
});

// تأكيد الدفع
export const confirmPayment = asyncHandler(async (req, res) => {
    const { paymentIntentId } = req.body;

    if (!paymentIntentId) {
        res.status(400).json({ success: false, message: "Payment Intent ID is required" });
        return;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
        res.status(200).json({
            success: true,
            message: "Payment confirmed successfully",
            data: paymentIntent,
        });
    } else {
        res.status(400).json({
            success: false,
            message: "Payment not confirmed",
            status: paymentIntent.status,
        });
    }
});
