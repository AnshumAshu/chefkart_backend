const { cloudinary } = require("../config/Cloudinary");
const Food= require("../model/FoodGallery.Model");

//create a new food post with the provided data

const createFood = async (req, res) => {
  try {
    const {  image } = req.body;
    // validation process
    if ( !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    } 
    const newHome = new Food({
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

// get all food
const getallFood = async (req, res) => {
  try {
    const Homes = await Food.find();
    res.status(200).json(Homes); // Corrected from "blog" to "blogs"
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Delete a food item by ID
const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid food ID format" });
    }
    const food = await Food.findById(id);
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const deletedFood = await Food.findByIdAndDelete(id);
    res.status(200).json({
      message: "Food successfully deleted",
      deletedFood
    });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports={
    createFood ,
    getallFood,
    deleteFood 
};