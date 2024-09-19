import express from "express";
import { isAuthenticatedUser } from "../middlewares/auth.js";
import { razorpayCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

// Route to create Razorpay checkout session
router.post(
  "/payment/razorpay_order",
  isAuthenticatedUser,
  razorpayCheckoutSession
);

export default router;
