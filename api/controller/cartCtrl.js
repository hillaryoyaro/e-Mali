const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const validateMongodbId = require("../utils/validateMongodbId");

//User cart
const createUserCart = asyncHandler(async(req,res) => {

    const { cart } = req.body;
    console.log(cart);
    const { _id } = req.user;
    validateMongodbId(_id);
    try{
        //creating an empty object array. 
        let products = [];
        const user = await User.findById(_id);
        //Checking if user already has products in cart
        const alreadyExistCart = await Cart.findOne({ orderedBy: user._id });
        if (alreadyExistCart) {
            alreadyExistCart.remove();
        }
        for (let i = 0; i < cart.length; i++) {
            let object = {};
            object.product = cart[i]._id;
            object.count = cart[i].count;
            object.color = cart[i].color;
            //calculating the price
            let getPrice = await Product.findById(cart[i]._id).select("price").exec();
            console.log(getPrice);
            object.price = getPrice.price;
            products.push(object);
            console.log(products)
        }
        //Finding the total
        let cartTotal = 0;
        for (let i = 0; i < products.length; i++) {
            cartTotal = cartTotal + products[i].price * products[i].count;
        }
        console.log(products,cartTotal);
        let newCart = await new Cart({
            products,
            cartTotal,
            orderedBy: user?._id,
        }).save()
        res.json(newCart);
    }catch (error) {
        throw new Error(error);
    }
});  

//Creating Get user cart

const getUserCart = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    console.log(_id);
    validateMongodbId(_id);
    
    try{
        const cart = await Cart.findOne({orderedBy:_id}).populate(
            "products.product"
        );
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
});

//Creating empty cart functionality
const emptyCart = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    console.log(_id);
    validateMongodbId(_id);
    
    try{
        const user = await User.findOne({_id});
        const cart = await Cart.findOneAndRemove({ orderby:_id});  
        res.json(cart);
    }catch(error){
        throw new Error(error);
    }
});

//Get user Cart
module.exports = {createUserCart,getUserCart,emptyCart};