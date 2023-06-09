const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const { generateToken } = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");
const crypto = require("crypto");

const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const findUser = await User.findOne({email:email});
    if (!findUser) {
        //creating instance of  anew user
        const newUser =  await User.create(req.body);
        res.json(newUser)
    } else{
       throw new Error("User Already Exist");
    }
});

//User Login
const loginUserCtr = asyncHandler(async(req,res) =>{
    const {email,password} = req.body;
    //check if user exist or not
    const findUser = await User.findOne({email});
    if (findUser && ( await findUser.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findUser?.id);
        const updateuser = await User.findByIdAndUpdate(findUser.id,
            {
                refreshToken:refreshToken,
            },
            {
                new:true
            }
        );
        res.cookie("refreshToken",refreshToken,
         {
         httpOnly:true,
         maxAge: 72 * 60 * 60 * 1000,
         });
        res.json({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            username: findUser?.username,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token: generateToken(findUser?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    };
});

//Admin Login
const loginAdmin = asyncHandler(async(req,res) =>{
    const {email,password} = req.body;
    //check if user exist or not
    const findAdmin = await User.findOne({email});
    if (findAdmin.role !== 'admin') throw new Error("Not authorized");
    if (findAdmin && ( await findAdmin.isPasswordMatched(password))){
        const refreshToken = await generateRefreshToken(findAdmin?.id);
        const updateuser = await User.findByIdAndUpdate(findAdmin.id,
            {
                refreshToken:refreshToken,
            },
            {
                new:true
            }
        );
        res.cookie("refreshToken",refreshToken,
         {
         httpOnly:true,
         maxAge: 72 * 60 * 60 * 1000,
         });
        res.json({
            _id: findAdmin?._id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            username: findAdmin?.username,
            email: findAdmin?.email,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?._id)
        });
    }else{
        throw new Error("Invalid Credentials");
    };
});

//Handle RefreshToken --->AsyncHandler
const handleRefreshToken = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    console.log(refreshToken);
    const user = await User.findOne({refreshToken});
    if (!user) throw new Error('No Refresh token in the db or not matched');
    jwt.verify(refreshToken,process.env.JWT_SECRET,(err,decoded) => {
        if (err || user.id !== decoded.id){
            throw new Error("There is something wrong with Refresh token");
        }
        const accessToken = generateToken(user?._id);
        res.json({accessToken}); 
    });
});

//Logout function
const logout = asyncHandler(async (req,res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({refreshToken});
    if (!user){
        res.clearCookie("refreshToken",{
            httpOnly:true,
            secure:true,
        });
        return res.sendStatus(204);//forbidden
    }
    await User.findOneAndUpdate(refreshToken,{
        refreshToken:""
    });
    res.clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    });
    res.sendStatus(204);//forbidden 
});

//Performming CRUD OPERATION
//Get all users ---> async Handler
const getallUser = asyncHandler(async(req,res) => {
    try{
        const getUsers = await User.find();
        res.json(getUsers);
    }
    catch(error){
        throw new Error(error);
    }
});

//Get user ---> async Handler
const getUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const getuser = await User.findById(id);
        res.json({getuser});
    }
    catch(error){
        throw new Error(error);
    }
});

//Delete user ---> async Handler
const deleteUser = asyncHandler(async(req,res) =>{
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const deleteuser = await User.findByIdAndDelete(id);
        res.json({deleteuser});
    }
    catch(error){
        throw new Error(error);
    }
});

//Update User ---> we will wrap inside asyncHandler module
const updateUser = asyncHandler(async(req,res) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const updateuser = await User.findByIdAndUpdate(_id,{
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            username: req?.body?.username,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
        },
        {
            new:true,
        }
        );
        res.json(updateuser); 
    }
    catch(error){
        throw new Error(error);
    }
});

//Save User Address
const saveAddress = asyncHandler(async(req,res,next) => {
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const updateaddress = await User.findByIdAndUpdate(_id,{
            address: req?.body?.address,
        
        },
        {
            new:true,
        }
        );
        res.json(updateaddress); 
    }
    catch(error){
        throw new Error(error);
    }
});

//block user -->wrapping inside asynchandler
const blockUser = asyncHandler(async(req,res) => {
    console.log(req.params);
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const block = await User.findByIdAndUpdate(
        id,
        {
            isBlocked:true,
        },
        {
            new:true
        });
        res.json({
            message:"User Blocked"
        });
    }catch(error){
        throw new Error(error);
    }
});

//unblock user -->wrapping inside asynchandler
const unblockUser = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongodbId(id);
    try{
        const unblock = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new:true,
            }
            )
            res.json({
                message:"User UnBlocked"
            });
    }catch(error){
        throw new Error(error);
    }
});

//Update password
const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    // extract the password and confirmpassword string values from the req.body object
    const { password, confirmpassword } = req.body; 
    validateMongodbId(_id);
    const user = await User.findById(_id);
    // check that password and confirmpassword fields are non-empty and match
    if (password && password === confirmpassword) { 
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
      // if password field is empty, return user object without updating password
    } else if (!password) { 
      res.json(user);
    } else { // if password and confirmpassword fields don't match, return error response
      res.status(400).json({ message: 'Password and confirm password fields do not match' });
    }
  });

  //Generate Forgot password Token
  const forgotPasswordToken = asyncHandler(async(req,res) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user) throw new Error("User not found with this email");
    try{
        const token = await user.createPasswordResetToken();
        await user.save();
        const resetURL = `Hi,Please follow this link to reset Your Password. this link is valid till 10 minute from now.<a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</a>`
        const data = {
            to:email,
            text:"Hello Client",
            subject:"Forgot Password Link",
            htm:resetURL,
        };
        sendEmail(data);
        res.json(token);
    }catch(error){
        throw new Error(error);
    }
  });

  //Reset password 
  const resetPassword = asyncHandler(async(req,res) => {
    const {password} = req.body;
    const {token} = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    //with help of toke we will find our user
    const user = await User.findOne({
        passwordResetToken:hashedToken,
        passwordResetExpires: {$gt:Date.now() },
    });
    if(!user) throw new Error("Toke Expired,Please try again later");
    user.password =password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  }); 

//Get Wishlist
const getWishList = asyncHandler(async (req, res) => {
    const {_id} = req.user;
  
    // Check if the _id value is a valid MongoDB ID
    validateMongodbId(_id);
    try {
      const findUser = await User.findById(_id).populate("wishlist");
      if (!findUser) {
        return res.status(404).json({message: "User not found"});
      }
      res.json(findUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Server error"});
    }
  });

//Apply coupon functionality
const applyCoupon = asyncHandler(async(req,res) => {
    const {coupon} = req.body;
    const {_id} = req.user;
    validateMongodbId(_id);
    try{
        const validCoupon = await Coupon.findOne({name:coupon});
        if (validCoupon == null){
            throw new Error("Invalid coupon")
        }
        //find the user
        const user = await User.findOne({_id});
        let {cartTotal} = await Cart.findOne({oderby:user._id,
        }).populate("products.product");
        let totalAfterDiscount = (
            cartTotal - (cartTotal * validCoupon.discount)/100)
            .toFixed(2);
            await Cart.findOneAndUpdate(
                {orderby:user._id},
                {totalAfterDiscount},
                {new:true}    
                );
                res.json(totalAfterDiscount);
    }catch(error){
        throw new Error(error);
    }
});  

module.exports = {
    createUser,
    loginUserCtr,
    getallUser,
    getUser,
    deleteUser,
    updateUser ,
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
    applyCoupon
};