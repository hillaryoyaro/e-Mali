const express = require("express");
const { createOrder, getOrders, updateOrderStatus } = require("../controller/orderCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

//defination of our routes
router.post("/",authMiddleware,createOrder);
router.get("/user/orders",authMiddleware,getOrders);
router.put("/update/:id", authMiddleware, isAdmin, updateOrderStatus);


module.exports = router;