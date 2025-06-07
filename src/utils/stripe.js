import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // تأكد من إضافة المفتاح في ملف .env
export default stripe;
