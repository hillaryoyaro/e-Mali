const express = require("express");
const { createUserCart, getUserCart, emptyCart } = require("../controller/cartCtrl");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

//--authMiddleware should start,then isAdmin then the resourceEndpoint
//primary router
router.post("/",authMiddleware,createUserCart);
router.get("/cart",authMiddleware,getUserCart);
router.delete("/empty-cart",authMiddleware,emptyCart);

module.exports = router;
