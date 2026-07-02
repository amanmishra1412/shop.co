const { Router } = require("express");
const cartController = require("../controllers/cartController");

const routes = Router();
const auth = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();

router.post("/add",auth, cartController.addToCart);//tested

router.get("/readcart",auth, cartController.getCart);  //tested

router.put("/update/:itemId",auth,cartController.updateQuantity);  //tested

router.delete("/remove/:itemId",auth, cartController.removeItem);   //tested


router.delete("/clear",auth, cartController.clearCart);   //tested

module.exports = router;
