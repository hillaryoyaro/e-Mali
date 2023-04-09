const ProductCategory = require('../models/productcategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");

//Create Product Category
const createproductCategory = asyncHandler(async(req,res) => {
    try{
        const newcategory = await ProductCategory.create(req.body);
        res.json(newcategory);
    }catch(error){
        throw new Error(error)
    }
});

//Update  Product Category
const updateproductCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatecategory = await ProductCategory.findOneAndUpdate(id,req.body,
            {new:true}
            );
        res.json(updatecategory);
    }catch(error){
        throw new Error(error)
    }
});

//Delete Product category
const deleteproductCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletecategory = await ProductCategory.findByIdAndDelete(id,req.body,
            {new:true}
            );
        res.json(deletecategory);
    }catch(error){
        throw new Error(error)
    }
});

//Fetch Product Category
const getproductCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getcategory = await ProductCategory.findById(id);
        res.json(getcategory);
    }catch(error){
        throw new Error(error)
    }
});

//Get All Product Category
const getallproductCategory = asyncHandler(async(req,res) => {
    try{
        const getallcategory = await ProductCategory.find();
        res.json(getallcategory);
    }catch(error){
        throw new Error(error)
    }
});
module.exports = {
    createproductCategory,
    updateproductCategory,
    deleteproductCategory,
    getproductCategory,
    getallproductCategory
};