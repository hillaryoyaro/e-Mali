const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");

//Create Brand 
const createBrand= asyncHandler(async(req,res) => {
    try{
        const newbrand = await Brand.create(req.body);
        res.json(newbrand);
    }catch(error){
        throw new Error(error)
    }
});

//Update  Brand
const updateBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatebrand = await Brand.findOneAndUpdate(id,req.body,
            {new:true}
            );
        res.json(updatebrand);
    }catch(error){
        throw new Error(error)
    }
});

//Delete Brand
const deleteBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletebrand = await Brand.findByIdAndDelete(id,req.body,
            {new:true}
            );
        res.json(deletebrand);
    }catch(error){
        throw new Error(error)
    }
});

//Fetch Brand
const getBrand = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getbrand = await Brand.findById(id);
        res.json(getbrand);
    }catch(error){
        throw new Error(error)
    }
});

//Get All Brand
const getallBrand = asyncHandler(async(req,res) => {
    try{
        const getallbrand = await Brand.find();
        res.json(getallbrand);
    }catch(error){
        throw new Error(error)
    }
});
module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand
};