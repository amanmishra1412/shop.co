const express = require("express");

const router = express.Router();

const {
    addToCart,
    getCart,
    updateQuantity,
    removeItem,
    clearCart,
} = require("../controllers/cartController");

const requireSignIn = require("../middlewares/authMiddleware");

router.use(requireSignIn);

router.get("/", getCart);

router.post("/add", addToCart);

router.put("/item/:itemId", updateQuantity);

router.delete("/item/:itemId", removeItem);

router.delete("/clear", clearCart);

module.exports = router;