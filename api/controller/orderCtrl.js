const User = require("../models/userModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const uniqid = require("uniqid");

const createOrder = asyncHandler(async (req, res, next) => {
    try {
        const { COD, couponApplied } = req.body;
        const { _id } = req.user;
        validateMongoDbId(_id);

        // Check if the order is cash on delivery
        if (!COD) {
            throw new Error("Invalid payment method");
        }

        // Get the user and their cart
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("User not found");
        }

        const userCart = await Cart.findOne({ orderedBy: user._id });
        if (!userCart) {
            throw new Error("Cart not found");
        }

        // Calculate the final amount based on coupon and cart total
        let finalAmount = 0;
        if (couponApplied && userCart.totalAfterDiscount) {
            finalAmount = userCart.totalAfterDiscount;
        } else {
            finalAmount = userCart.cartTotal;
        }

        // Create a new order with the user's cart, payment details, and order status
        const newOrder = await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Pay on Delivery",
                created: Date.now(),
                currency: "KSh",
            },
            orderedBy: user._id,
            orderStatus: "Pay on Delivery",
        }).save();

        // Update the product quantity and sold status
        const updateProducts = userCart.products.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item.product._id },
                    update: { $inc: { quantity: -item.count, sold: +item.count } },
                },
            };
        });
        const updated = await Product.bulkWrite(updateProducts, {});

        // Send the response
        res.json({ success: true, message: "Order created successfully" });
    } catch (error) {
        // If an error occurs, pass it to the error handling middleware
        next(error);
    }
});

//Get Order
const getOrders = asyncHandler(async(req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try {
        const userOrders = await Order.findOne({ orderedBy: _id })
            .populate("products.product")
            .exec();
        res.json(userOrders);
    } catch(error) {
        throw new Error(error);
    }
});

const updateOrderStatus = asyncHandler(async(req, res) => {
    const { status } = req.body;
    const { id } = req.params;
    validateMongoDbId(id);
    try{
        const orderStatus = await Order.findByIdAndUpdate(
            id,
            {
                orderStatus: status,
                paymentIntent: {
                    status: status,
                },
            },
            {new: true}
        );
        res.json(orderStatus);
    }catch(error) {
        throw new Error(error);
    }
});
module.exports = { createOrder,getOrders,updateOrderStatus };
