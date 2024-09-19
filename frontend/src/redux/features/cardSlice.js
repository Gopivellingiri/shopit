import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  saveShippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItem: (state, action) => {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (existingItem) {
        state.cartItems = state.cartItems.map((i) =>
          i.product === existingItem.product
            ? { ...i, quantity: item.quantity }
            : i
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    removeCartItem: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    clearCart: (state, action) => {
      localStorage.removeItem("cartItems");
      state.cartItems = [];
    },
    setShippingInfo: (state, action) => {
      state.saveShippingInfo = action.payload;

      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },
  },
});

export const { setCartItem, removeCartItem, setShippingInfo, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
