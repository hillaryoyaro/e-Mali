const express = require('express');
const { 
    createBlog,updateBlog, 
    getBlog, 
    getAllBlogs, 
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages
 } = require('../controller/blogCtrl');
const { authMiddleware, isAdmin} = require('../middlewares/authMiddleware');
const { uploadPhoto, blogImgResize } = require('../middlewares/uploadImages');
const router = express.Router();


router.post('/',authMiddleware, isAdmin ,createBlog);
router.put('/likes',authMiddleware,likeBlog);
router.put('/dislikes',authMiddleware,dislikeBlog);
router.put("/upload/:id",authMiddleware,isAdmin,uploadPhoto.array('images',10),blogImgResize,uploadImages);
router.put('/:id',authMiddleware, isAdmin ,updateBlog);
router.delete('/:id',authMiddleware, isAdmin ,deleteBlog);
router.get('/:id',authMiddleware, isAdmin ,getBlog);
router.get('/',authMiddleware, isAdmin ,getAllBlogs);



module.exports = router;