const { cloudinary } = require("../config/Cloudinary");
const Home = require("../model/HomeImage.Model");

// Create a new home entry
const createKitchen = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content || !category || !image) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const existingData = await Home.findOne({ title });
    if (existingData) {
      return res.status(400).json({ message: "This blog already exists" });
    }

    let imageUrl = image;
    if (!image.startsWith("http")) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "home",
      });
      imageUrl = result.secure_url;
    }

    const newHome = new Home({
      title,
      content,
      category,
      image: imageUrl,
    });

    await newHome.save();

    res.status(201).json({
      message: "Home page data successfully created",
      home: newHome,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all home page entries
const getallHomeImage = async (req, res) => {
  try {
    const homes = await Home.find();

    if (!homes.length) {
      return res.status(404).json({ message: "No home entries found" });
    }

    res.status(200).json(homes);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a single home entry by ID
const getHomeById = async (req, res) => {
  try {
    const { id } = req.params;

    const home = await Home.findById(id);

    if (!home) {
      return res.status(404).json({ message: "Home entry not found" });
    }

    res.status(200).json(home);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a home entry by ID
const updateHomePage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, category, image } = req.body;

    let imageUrl = image;

    // Upload new image only if it's not already a URL
    if (image && !image.startsWith("http")) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "home",
      });
      imageUrl = result.secure_url;
    }

    const updatedHome = await Home.findByIdAndUpdate(
      id,
      { title, content, category, image: imageUrl },
      { new: true }
    );

    if (!updatedHome) {
      return res.status(404).json({ message: "Home entry not found" });
    }

    res.status(200).json({
      message: "Home page entry successfully updated",
      updatedHome,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a home entry by ID
const deletehomePage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedHome = await Home.findByIdAndDelete(id);

    if (!deletedHome) {
      return res.status(404).json({ message: "Home entry not found" });
    }

    res.status(200).json({
      message: "Home entry successfully deleted",
      deletedHome,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createKitchen,
  getallHomeImage,
  getHomeById,
  updateHomePage,
  deletehomePage,
};
