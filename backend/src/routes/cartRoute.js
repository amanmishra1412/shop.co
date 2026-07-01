const { Router } = require("express");
const cartController  = require("../controllers/cartController")

const routes = Router();

const express = require("express");
const router = express.Router();





router.post("/add",  cartController.addToCart);

router.get("/",  cartController.getCart);

router.put("/update/:itemId",  cartController.updateQuantity);

router.delete("/remove/:itemId",  cartController.removeItem);

router.delete("/clear",  cartController.clearCart);

module.exports = router;