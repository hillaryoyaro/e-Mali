const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg= require("../utils/cloudinary"); 
const fs = require("fs");
//create new product--->wraping asyncHandler
const createProduct = asyncHandler(async (req,res) => {
    try{
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const newProduct = await Product.create(req.body);
        res.json(newProduct)
    }catch(error){
        throw new Error(error)
    }
});

//Perfom FSLP frame work on the route
//Get request for single product
const getProduct = asyncHandler(async (req,res) => {
    const {id} = req.params;
    try{
        const findproduct = await Product.findById(id);
        res.json(findproduct);
    }catch(error){
        throw new Error(error);
    }
});

//Perfom FSLP framework on the route
//Get request for all product
const getAllproduct = asyncHandler(async (req,res) => {
    try{
//Step1:Filtering

        const queryObject = {...req.query };
        //creates an array of query parameters to exclude (page, sort, limit, and fields) 
        //and removes them from queryObject using the forEach() method.
        const excludefields = ["page","sort","limit","fields"];
        excludefields.forEach((el) => delete queryObject[el]);
        //creates a string representation of the remaining query parameters.
        let queryStr = JSON.stringify(queryObject);
        //This creates a valid MongoDB query string that can be used to query the database.
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,(match) => `$${match}`);
        //creates a new query using the find() method on the Product model
        // with the parsed query string as its argument
        let  query = Product.find(JSON.parse(queryStr));
        //code then awaits the resulting product object.

 //Step 2:Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(" ");
            query = query.sort(sortBy);
        }else{
            query = query.sort("-createdAt");
        }
//Step 3:Limiting the Field
        if(req.query.fields){
            const fields =req.query.fields.split(',').join(" ");
            query = query.select(fields);
        }else{
            query = query.select('-__v');
        }
//Step4:Pagination
        
        const page = req.query.page;
        const limit = req.query.limit;
        const skip = (page -1) * limit;
        query = query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount = await Product.countDocuments();
            if(skip>=productCount) throw new Error('This Page does not exist');
        }
        console.log(page,limit,skip);


        const product = await query;
                res.json(product);
    }catch(error){
        throw new Error(error);
    }
});

//Update Product
const updateProduct = asyncHandler(async (req,res) => {
    const {id} = req.params;
    console.log(req.params);
    try{
    if(req.body.title) {
        req.body.slug = slugify(req.body.title);
    }
    const updateproduct = await Product.findOneAndUpdate(id,req.body,{
        new:true
    });
    res.json(updateproduct);
    console.log(updateproduct);
    }catch(error){
        throw new Error(error);
    }
});

//Delete product
const deleteProduct = asyncHandler(async (req,res) => {
    const {id} = req.params;
    try{
        const deleteproduct = await Product.findByIdAndDelete(id);
        res.json(deleteproduct);
    }catch(error){
        throw new Error(error);
    }
});
//Wishlist Functionality of our Product
const addToWishlist = asyncHandler(async (req, res) => {
    const {_id} = req.user;
    const { prodId } = req.body;
    validateMongoDbId(_id);
    
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //Cheking if the user is already added
    const isAlreadyAdded = user.wishlist.find((id) => id.toString() === prodId);
    console.log(prodId);
    let updatedUser;
    if (isAlreadyAdded) { // if already addded remove from wishlist
      updatedUser = await User.findByIdAndUpdate(
        _id,
        { $pull: { wishlist: prodId } },
        { new: true }
      );
    } else { 
      updatedUser = await User.findByIdAndUpdate(
        _id,
        { $push: { wishlist: prodId } },   //otherwise push product id
        { new: true }
      );
    }

    return res.json(updatedUser);
  });

  //Rating
const rating = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    const {star,prodId,comment} = req.body;
    console.log(_id);
    try {
        const product = await Product.findById(prodId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
      console.log(prodId)  ;
      let alreadyRated = product.ratings.find(userId => userId.postedby.toString() === _id.toString());
      console.log('Already Rated:', alreadyRated);
      
      if (alreadyRated) {
        const updateRating = await Product.updateOne(
           { 
                'ratings._id': alreadyRated._id 
           },
          { 
            $set: { 'ratings.$.star': star,'ratings.$.comment': comment } 
           },
          { new: true }
        );
        console.log('Update Rating:', updateRating);
      } else {
        const rateProduct = await Product.findByIdAndUpdate(
          prodId,
          {
            $push: {
              ratings: {
                star: star,
                comment:comment,
                postedby: _id,
              },
            },
          },
          { new: true }
        );
        console.log('Rate Product:', rateProduct);
      }
  
      const allRatings = await Product.findById(prodId);
      console.log('All Ratings:', allRatings);
      
      const totalRating = allRatings.ratings.length;
      const ratingSum = allRatings.ratings
      .map(item => item.star)
      .reduce((prev, curr) => prev + curr, 0);
      const actualRating = Math.round(ratingSum / totalRating);
      console.log('Actual Rating:', actualRating);
  
      const updatedProduct = await Product.findByIdAndUpdate(prodId, {
        totalrating: actualRating,
      }, { new: true });
      console.log('Updated Product:', updatedProduct);
  
      res.json(updatedProduct);
    } catch(error) {
      console.error(error);
      throw new Error(error);
    }
  });

  
//Image Upload
const uploadImages = asyncHandler(async(req,res) =>{
    const {id} =req.params;
    console.log(id);
    validateMongoDbId(id);
    console.log(id);
    try{
        const uploader = (path) => cloudinaryUploadImg(path,"images");
        const urls = [];
        const files = req.files;
        for (const file of files){
            const {path} = file;
            const newpath = await uploader(path);
            console.log(newpath);
            urls.push(newpath);
            fs.unlinkSync(path);
        }
        
        const findProduct = await Product.findByIdAndUpdate(id,{
            images: urls.map((file) => {
                return file;
            }),
        },
        {
            new:true,
        }
        );
        res.json(findProduct);
    }catch(error){
        throw new Error(error);
    }
});  

module.exports={
    createProduct,
    getProduct,
    getAllproduct,
    updateProduct,
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
};