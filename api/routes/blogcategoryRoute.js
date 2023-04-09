const express = require("express");
const { 
    createblogCategory, 
    updateblogCategory, 
    deleteblogCategory,
    getblogCategory,
    getallblogCategory
} = require("../controller/blogcategoryCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

//Route defination
router.post('/',authMiddleware,isAdmin,createblogCategory);
router.put('/:id',authMiddleware,isAdmin,updateblogCategory);
router.delete('/:id',authMiddleware,isAdmin,deleteblogCategory);
router.get('/:id',authMiddleware,isAdmin,getblogCategory);
router.get('/',authMiddleware,isAdmin,getallblogCategory);

module.exports = router;