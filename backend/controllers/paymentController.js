// controllers/paymentController.js

import Razorpay from "razorpay";
import catchAsyncError from "../middlewares/catchAsyncError.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const razorpayCheckoutSession = catchAsyncError(
  async (req, res, next) => {
    const { totalAmount } = req.body; // Amount should be in the smallest currency unit (e.g., paise for INR)

    try {
      const options = {
        amount: totalAmount * 100, // Amount in paise
        currency: "USD", // Change this based on your currency
        receipt: `order_rcptid_${Math.random()}`,
      };

      const order = await razorpay.orders.create(options);

      res.status(200).json({
        success: true,
        orderID: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Razorpay checkout session creation failed.",
      });
    }
  }
);
