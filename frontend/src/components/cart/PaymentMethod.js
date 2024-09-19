import React, { useEffect, useState } from "react";
import CheckoutSteps from "./CheckoutSteps";
import { useDispatch, useSelector } from "react-redux";
import { calculateOrderCart } from "../../helpers/helpers";
import {
  useCreateNewOrderMutation,
  useRazorpayCheckoutSessionMutation,
} from "../../redux/api/orderApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../../redux/features/cardSlice";

const PaymentMethod = () => {
  const { user } = useSelector((state) => state.auth);
  const [method, setMethod] = useState("");
  const navigate = useNavigate();
  const { saveShippingInfo, cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [razorpayCheckoutSession] = useRazorpayCheckoutSessionMutation();
  const [createNewOrder, { isLoading, error, isSuccess }] =
    useCreateNewOrderMutation();

  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      navigate("/me/orders?order_success=true");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();

    const { itemPrice, shippingPrice, taxPrice, totalPrice } =
      calculateOrderCart(cartItems);

    if (method === "COD") {
      // Create COD Order
      const orderData = {
        shippingInfo: saveShippingInfo,
        orderItems: cartItems,
        itemsPrice: itemPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
        paymentInfo: {
          status: "Not Paid",
        },
        paymentMethod: "COD",
      };
      createNewOrder(orderData);
    }
    if (method === "Card") {
      const orderData = {
        shippingInfo: saveShippingInfo,
        orderItems: cartItems,
        itemsPrice: itemPrice,
        shippingAmount: shippingPrice,
        taxAmount: taxPrice,
        totalAmount: totalPrice,
      };

      // Call Razorpay Checkout API here
      razorpayCheckoutSession(orderData)
        .unwrap()
        .then((response) => {
          const options = {
            key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your Razorpay Key ID
            amount: response.amount, // Amount in paise
            currency: response.currency,
            name: "shopit",
            description: "Payment for your order",
            order_id: response.orderID, // Razorpay order ID
            handler: function (paymentResponse) {
              dispatch(clearCart()); // Clear cart from Redux
              localStorage.removeItem("cartItems"); // Clear cart from localStorage

              toast.success("Payment successful, cart cleared!");
              navigate("/order-confirmation");
            },
            prefill: {
              name: user?.name,
              email: user?.email,
              contact: user?.phoneNo,
            },
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        })
        .catch((error) => {
          toast.error("Razorpay checkout session failed.");
        });
    }
  };
  return (
    <>
      <CheckoutSteps Shipping ConfirmOrder payment />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">Select Payment Method</h2>

            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="codradio"
                value="COD"
                onChange={(e) => setMethod(e.target.value)} // Updated to use e.target.value
              />
              <label className="form-check-label" htmlFor="codradio">
                Cash on Delivery
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="payment_mode"
                id="cardradio"
                value="Card"
                onChange={(e) => setMethod(e.target.value)} // Updated to use e.target.value
              />
              <label className="form-check-label" htmlFor="cardradio">
                Card - VISA, MasterCard
              </label>
            </div>

            <button id="shipping_btn" type="submit" className="btn py-2 w-100">
              CONTINUE
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
