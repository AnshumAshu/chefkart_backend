const { cloudinary } = require("../config/Cloudinary");
const FoodGaller= require("../model/FoodGall.Model");

//create a new blog post with the provided data

const createFood = async (req, res) => {
  try {
    const {  image } = req.body;
    /// validation process
    if ( !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // check   if the blog is already exists
  

    
    const newHome = new FoodGaller({
      
      image,
    });
    await newHome.save();

    res.status(201).json({
      message: "Food Page is successfully created",
      
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// get all foodgall posts
const getallFood = async (req, res) => {
  try {
    const Homes = await FoodGaller.find();

 
    
    res.status(200).json(Homes); // Corrected from "blog" to "blogs"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
 

    // Validate if ID is a valid MongoDB ObjectId
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid blog ID format" });
    }
    // Delete the blog
    const deletedFood = await FoodGaller.findByIdAndDelete(id);

    res.status(200).json({
      message: "Food successfully deleted",
      deletedFood,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



module.exports={
    createFood ,
    getallFood,
    deleteFood 
};