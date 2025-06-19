const { cloudinary } = require("../config/Cloudinary");
const Blog = require("../model/Blog.Model");

//create a new blog post with the provided data

const createBlog = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    /// validation process
    if (!title || !content || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    //if the blog already exist
    const existingData=await Blog.findOne({title});
    if(existingData){
      return res.status(400).json({ message: "this blog already exist" });
    }
    const newBlog = new Blog({
      title,
      content,
      category,
      image,
    });
    await newBlog.save();

    res.status(201).json({
      message: "Blog is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all blog posts
const getallBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    if (!blogs.length) {
      return res.status(404).json({ message: "No blog posts found" });
    }

    res.status(200).json(blogs); // ✅ Corrected from `blog` to `blogs`
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


//getting a single blog
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blogs = await Blog.findById(id);

    if (!blogs) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// update all blogs
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, image } = req.body;
    let imageUrl = "";
    //image uploading process
    if (image) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "blogs",
      });
      imageUrl = result.secure_url;
    }
    const updateBlogs = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        category,
        image: imageUrl,
      },
      { new: true }
    );

    if (!updateBlogs) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({
      message: "Blog  is successfully updated successfully",
      updateBlogs,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// delete a blog post by id

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.status(200).json({
      message: "Blog is successfully deleted",
      deletedBlog,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


module.exports={
    createBlog,
    getallBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};