const express = require('express');
const { 
    createproductCategory, 
    updateproductCategory, 
    deleteproductCategory,
    getproductCategory,
    getallproductCategory
} = require('../controller/productcategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddleware');
const router = express.Router();

//Router defination
router.post('/',authMiddleware,isAdmin,createproductCategory);
router.put('/:id',authMiddleware,isAdmin,updateproductCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteproductCategory);
router.get('/:id',authMiddleware,isAdmin,getproductCategory);
router.get('/',authMiddleware,isAdmin,getallproductCategory);

module.exports = router;