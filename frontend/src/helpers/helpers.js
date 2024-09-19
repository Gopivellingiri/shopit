export const getPriceQueryParams = (searchParams, key, value) => {
  const hasValueInParams = searchParams.has(key);

  if (value && hasValueInParams) {
    searchParams.set(key, value);
  } else if (value) {
    searchParams.append(key, value);
  } else if (hasValueInParams) {
    searchParams.delete(key);
  }
  return searchParams;
};

export const calculateOrderCart = (cartItems) => {
  const itemPrice = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.15 * itemPrice).toFixed(2));
  const totalPrice = (itemPrice + shippingPrice + taxPrice).toFixed(2);

  return {
    itemPrice: Number(itemPrice).toFixed(2),
    shippingPrice,
    taxPrice,
    totalPrice,
  };
};
