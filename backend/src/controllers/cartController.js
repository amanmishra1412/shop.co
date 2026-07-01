const Cart = require("../models/cartModel");
const Product = require("../models/productModel");


// Helper Function
const calculateCartTotals = (cart) => {
    let subtotal = 0;

    cart.items.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    cart.subtotal = subtotal;

    // For now
    cart.total = subtotal - cart.discountAmount + cart.deliveryFee;
};



// =========================
// Add Item To Cart
// =========================

exports.addToCart = async (req, res) => {

    try {

        const userId = '124';

        const {
            productId,
            quantity,
            size,
            color
        } = req.body;


        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }


        let cart = await Cart.findOne({ userId });

        if (!cart) {

            cart = new Cart({
                userId,
                items: []
            });

        }


        const existingItem = cart.items.find(item =>
            item.productId.toString() === productId &&
            item.size === size &&
            item.color === color
        );


        if (existingItem) {

            existingItem.quantity += quantity;

        } else {

            cart.items.push({
                productId,
                quantity,
                size,
                color,
                price: product.price
            });

        }

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



// =========================
// Get Cart
// =========================

exports.getCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            userId: req.user.id
        }).populate("items.productId");

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart is empty"
            });

        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// =========================
// Update Quantity
// =========================

exports.updateQuantity = async (req, res) => {

    try {

        const { itemId } = req.params;

        const { quantity } = req.body;

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }

        const item = cart.items.id(itemId);

        if (!item) {

            return res.status(404).json({
                success: false,
                message: "Item not found"
            });

        }

        item.quantity = quantity;

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Quantity updated",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// =========================
// Remove Item
// =========================

exports.removeItem = async (req, res) => {

    try {

        const { itemId } = req.params;

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }

        cart.items = cart.items.filter(item =>
            item._id.toString() !== itemId
        );

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed",
            cart
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};




// =========================
// Clear Cart
// =========================

exports.clearCart = async (req, res) => {

    try {

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {

            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });

        }

        cart.items = [];

        calculateCartTotals(cart);

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};