const Blog = require("../models/blogModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { validate } = require("../models/blogModel");
const cloudinaryUploadingImg = require("../utils/cloudinary");
const fs = require("fs");


//create blog
const createBlog = asyncHandler(async(req,res) => {
    try{
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    }catch(error){
        throw new Error(error);
    }
});

//updateblog
const updateBlog = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const updateBlog = await Blog.findById(id,req.body,{
            new:true
        });
        res.json(updateBlog);
    }catch(error){
        throw new Error(error);
    }
});

//get blog
//updateblog
const getBlog = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const getBlog = await Blog.findById(id).populate("likes");
        const getupdate = await Blog.findByIdAndUpdate(
        id,
        {
            $inc:{numViews:1},
        },
        {new:true}
        );
        res.json(getBlog);
    }catch(error){
        throw new Error(error);
    }
});

//Get all Blogs
const getAllBlogs = asyncHandler(async(req,res) => {
    try{
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    }catch(error){
        throw new Error(error);
    }
});

//Delete Blog
const deleteBlog = asyncHandler(async(req,res) => {
    const {id} = req.params;
    validateMongoDbId(id);
    try{
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    }catch(error){
        throw new Error(error);
    }
});

//Like Blog
const likeBlog = asyncHandler(async (req, res) => {
    try {
      // Get the blogId from the request body
      const { blogId } = req.body;
  
      // Validate the blogId
      validateMongoDbId(blogId); 
      // Find the blog to be liked
      const blog = await Blog.findById(blogId);
  
      // Get the ID of the logged-in user
      const loginUserId = req?.user?._id;
  
      // Check if the user has already disliked the blog
      const alreadyDisliked = blog?.dislikes.find(
        userId => userId?.toString() === loginUserId?.toString()
      );
  
      // If the user has already disliked the blog, remove the dislike
      if (alreadyDisliked) {
        const updatedBlog = await Blog.findByIdAndUpdate(
          blogId,
          { $pull: { dislikes: loginUserId }, isDisliked: false },
          { new: true }
        );
        return res.json(updatedBlog);
      }
  
      // Check if the user has already liked the blog
      const isLiked = blog?.isLiked;
  
      // If the user has already liked the blog, remove the like
      if (isLiked) {
        const updatedBlog = await Blog.findByIdAndUpdate(
          blogId,
          { $pull: { likes: loginUserId }, isLiked: false },
          { new: true }
        );
        return res.json(updatedBlog);
      }
  
      // Otherwise, add the like
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $push: { likes: loginUserId }, isLiked: true },
        { new: true }
      );
      return res.json(updatedBlog);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  });

//disLike Blog
const dislikeBlog = asyncHandler(async (req, res) => {
  try {
    // Get the blogId from the request body
    const { blogId } = req.body;

    // Validate the blogId
    validateMongoDbId(blogId); 
    // Find the blog to be liked
    const blog = await Blog.findById(blogId);

    // Get the ID of the logged-in user
    const loginUserId = req?.user?._id;

    // Check if the user has already liked the blog
    const alreadyliked = blog?.dislikes.find(
      userId => userId?.toString() === loginUserId?.toString()
    );

    // If the user has already liked the blog, remove the like
    if (alreadyliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { likes: loginUserId }, isLiked: false },
        { new: true }
      );
      return res.json(updatedBlog);
    }

    // Check if the user has already liked the blog
    const isDisliked = blog?.isDisliked;

    // If the user has already disliked the blog, remove the dislike
    if (isDisliked) {
      const updatedBlog = await Blog.findByIdAndUpdate(
        blogId,
        { $pull: { dislikes: loginUserId }, isDisliked: false },
        { new: true }
      );
      return res.json(updatedBlog);
    }

    // Otherwise, add the like
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { likes: loginUserId }, isLiked: true },
      { new: true }
    );
    return res.json(updatedBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

const uploadImages = asyncHandler(async(req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
      const uploader = (path) => cloudinaryUploadingImg(path, "images");
      const urls = [];
      const files = req.files;
      for (const file of files) {
          const { path } = file;
          const newPath = await uploader(path);
          urls.push(newPath);
          fs.unlinkSync(path);
      }
      const findBlog = await Blog.findByIdAndUpdate(
          id,
          {
              images: urls.map((file) => {
                  return file;
              }),
          },
          {
              new: true,
          }
      );
      res.json(findBlog);
  } catch (error) {
      throw new Error(error);
  }
});

module.exports = {
    createBlog,
    updateBlog,
    getBlog,
    getAllBlogs,
    deleteBlog,
    likeBlog,
    dislikeBlog,
    uploadImages
};