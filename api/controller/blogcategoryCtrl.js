const BlogCategory = require('../models/blogcategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require("../utils/validateMongodbId");

//Create Blog Category
const createblogCategory = asyncHandler(async(req,res) => {
    try{
        const newcategory = await BlogCategory.create(req.body);
        res.json(newcategory);
    }catch(error){
        throw new Error(error)
    }
});

//Update  Blog Category
const updateblogCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updatecategory = await BlogCategory.findOneAndUpdate(id,req.body,
            {new:true}
            );
        res.json(updatecategory);
    }catch(error){
        throw new Error(error)
    }
});

//Delete Blog category
const deleteblogCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deletecategory = await BlogCategory.findByIdAndDelete(id,req.body,
            {new:true}
            );
        res.json(deletecategory);
    }catch(error){
        throw new Error(error)
    }
});

//Fetch Blog Category
const getblogCategory = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getcategory = await BlogCategory.findById(id);
        res.json(getcategory);
    }catch(error){
        throw new Error(error)
    }
});

//Get All Blog Category
const getallblogCategory = asyncHandler(async(req,res) => {
    try{
        const getallcategory = await BlogCategory.find();
        res.json(getallcategory);
    }catch(error){
        throw new Error(error)
    }
});
module.exports = {
    createblogCategory,
    updateblogCategory,
    deleteblogCategory,
    getblogCategory,
    getallblogCategory
};