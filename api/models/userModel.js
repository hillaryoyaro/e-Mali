const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const expressAsyncHandler = require('express-async-handler');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmpassword:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user",
    },
    isBlocked:{
        type:Boolean,
        default:false,
    },
    cart:{
        type:Array,
        default: [],
    },
    address:{  //for single adrress ---
        type:String,
    },
    wishlist:[{type:mongoose.Schema.Types.ObjectId,ref:"Product"}],
    refreshToken:{
        type:String
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
},
    {
        timestamps:true,
    }
);


//middleware for encryption of password
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')){
        next();
    }
    const salt =  await bcrypt.genSaltSync(10);  
    this.password = await bcrypt.hash(this.password,salt);
});

//middleware for encryption of confirmpassword
userSchema.pre('save', async function (next) {
    const salt =  await bcrypt.genSaltSync(10);  
    this.confirmpassword = await bcrypt.hash(this.confirmpassword,salt);
});

//creating login functionality
userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

//Updaate ,Recover password
//middleware for reseting password using crypto module
userSchema.methods.createPasswordResetToken = async function(){
    const resettoken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resettoken)
    .digest("hex");
    this.passwordResetExpires = Date.now()+ 30 * 60  * 1000;//10 minutes
    return resettoken;
}


//Export the model
module.exports = mongoose.model('User', userSchema);