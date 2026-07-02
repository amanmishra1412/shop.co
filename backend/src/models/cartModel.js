const mongoose = require("mongoose");

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        size: { type: String, required: true },
        color: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    discountAmount: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 15 },
    total: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Cart", cartSchema);
