const express = require('express');
const { createUser,
    loginUserCtr, 
    getallUser, 
    getUser,
    deleteUser,
    updateUser,
    blockUser,
    unblockUser,
    handleRefreshToken,
    logout,
    updatePassword,
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishList,
    saveAddress,
    applyCoupon,
 } = require('../controller/userCtrl');
const { authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const router = express.Router();

//--authMiddleware should start,then isAdmin then the resourceEndpoint
//primary router
router.post("/register",createUser);
router.post("/forgot-password-token",forgotPasswordToken);
router.post("/cart/apply-coupon", authMiddleware, applyCoupon);

router.put("/reset-password/:token",resetPassword);
router.put("/password",authMiddleware,updatePassword);
router.post("/login",loginUserCtr);
router.post("/admin-login",loginAdmin);

router.get("/all-users",getallUser);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);
router.get("/wishlist",authMiddleware,getWishList);
//secondary router
router.get("/:id",authMiddleware,isAdmin,getUser);
router.delete("/:id",deleteUser);
router.put("/edit-user",authMiddleware,updateUser);
router.put("/save-address",authMiddleware,saveAddress);
router.put("/block-user/:id",authMiddleware,isAdmin, blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin, unblockUser);


module.exports = router;