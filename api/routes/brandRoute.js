const express = require("express");
const { 
    createBrand, 
    updateBrand, 
    deleteBrand, 
    getBrand, 
    getallBrand 
} = require("../controller/brandCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

//Route defination
router.post('/',authMiddleware,isAdmin,createBrand);
router.put('/:id',authMiddleware,isAdmin,updateBrand);
router.delete('/:id',authMiddleware,isAdmin,deleteBrand);
router.get('/:id',authMiddleware,isAdmin,getBrand);
router.get('/',authMiddleware,isAdmin,getallBrand);

module.exports = router;