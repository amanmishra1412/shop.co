exports.calculateCart = (cart) => {
  let subtotal = 0;

  cart.items.forEach((item) => {
    subtotal += item.price * item.quantity;
  });

  cart.subtotal = subtotal;

  cart.total =
    subtotal -
    cart.discountAmount +
    cart.deliveryFee;
};