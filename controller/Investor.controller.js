const { cloudinary } = require("../config/Cloudinary");
const Investor = require("../model/Investor.Model");

// Create a new investor
const createInvestor = async (req, res) => {
  try {
    const { title, subtitle, description, image } = req.body;

    const existingData = await Investor.findOne({ title });
    if (existingData) {
      return res.status(400).json({ message: "This investor already exists" });
    }

    const newInvestor = new Investor({ title, subtitle, description, image });
    await newInvestor.save();

    res.status(201).json({
      message: "Investor successfully created",
      investor: newInvestor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all investors
const getallInvestor = async (req, res) => {
  try {
    const investors = await Investor.find();
    if (!investors.length) {
      return res.status(404).json({ message: "No investor posts found" });
    }
    res.status(200).json(investors);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get investor by ID
const getInvestorById = async (req, res) => {
  try {
    const { id } = req.params;
    const investor = await Investor.findById(id);

    if (!investor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json(investor);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update investor
const updateInvestor = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, description, image } = req.body;

    let imageUrl = image;

    // Upload image only if it's a base64 or file path (not an existing URL)
    if (image && !image.startsWith("http")) {
      const result = await cloudinary.uploader.upload(image, {
        folder: "investors",
      });
      imageUrl = result.secure_url;
    }

    const updatedInvestor = await Investor.findByIdAndUpdate(
      id,
      { title, subtitle, description, image: imageUrl },
      { new: true }
    );

    if (!updatedInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({
      message: "Investor successfully updated",
      updateInvestor: updatedInvestor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete investor
const deleteInvestor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid investor ID format" });
    }

    const deletedInvestor = await Investor.findByIdAndDelete(id);

    if (!deletedInvestor) {
      return res.status(404).json({ message: "Investor not found" });
    }

    res.status(200).json({
      message: "Investor successfully deleted",
      deletedInvestor,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Export all handlers
module.exports = {
  createInvestor,
  getallInvestor,
  getInvestorById,
  updateInvestor,
  deleteInvestor,
};
