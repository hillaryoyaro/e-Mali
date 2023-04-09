//creating our server
const express = require('express');
const { 
    createProduct, 
    getProduct, 
    getAllproduct, 
    updateProduct, 
    deleteProduct,
    addToWishlist,
    rating,
    uploadImages
} = require('../controller/productCtrl');
const {isAdmin,authMiddleware} = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require('../middlewares/uploadImages');
const router = express.Router();

//--authMiddleware should start,then isAdmin then the resourceEndpoint
router.post("/",authMiddleware,isAdmin,createProduct);
router.put("/wishlist",authMiddleware,addToWishlist);
router.put("/rating",authMiddleware,rating);

router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages);
router.get("/:id", getProduct);
router.put("/:id",authMiddleware,isAdmin,updateProduct);
router.delete("/:id",authMiddleware,isAdmin,deleteProduct);
router.get("/",getAllproduct);


module.exports = router;