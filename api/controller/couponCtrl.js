const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

//create coupon
const createCoupon = asyncHandler(async(req,res) => {
    try{
        const createCoupon = await Coupon.create(req.body);
        res.json(createCoupon);
    }catch(error){
        throw new Error(error);
    }
});

//get all coupons
const getAllCoupons = asyncHandler(async(req,res) => {
    try{
        const coupons = await Coupon.find();
        res.json(coupons);
    }catch(error){
        throw new Error(error);
    }
});

// get a coupon
const getCoupon = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const coupon = await Coupon.findById(id);
        res.json(coupon);
    }catch(error){
        throw new Error(error);
    }
});

//update coupons
const updateCoupon = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const newcoupon = await Coupon.findByIdAndUpdate(id,req.body,{
            new:true,
        }
        );
        res.json(newcoupon);
    }catch(error){
        throw new Error(error);
    }
});

//delete coupons
const deleteCoupon = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletecoupon = await Coupon.findByIdAndDelete(id);
        res.json(deletecoupon);
    }catch(error){
        throw new Error(error);
    }
});

module.exports = {
    createCoupon,
    getAllCoupons,
    updateCoupon,
    deleteCoupon,
    getCoupon
};