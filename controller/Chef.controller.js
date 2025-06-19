const { cloudinary } = require('../config/Cloudinary');
const ChefModel = require('../model/Chef.model');
const {mongoose}=require('mongoose');

// Create Chef
const createChef = async (req, res) => {
   try {
       const {
           name,
           Address,
           profilepic, // This should be a Base64 string (with data:image/jpeg;base64,...)
           default_cook_image,
           city,
           state,
           area,
           country,
           pincode,
           email,
           phone,
           experience,
           verified,
           starRating,
           totalRatings,
           language,
           veg,
           nonVeg,
           aboutCook,
           cuisineRatings,
           availableLocations,
           availability,
           housesServed
       } = req.body;

       // ✅ Check required fields
       if (!name || !Address || !city || !state || !area || !country || !pincode || !email || !phone || !experience) {
           return res.status(400).json({ message: "All required fields must be filled" });
       }

       // ✅ Check if chef already exists by email
       const existingChef = await ChefModel.findOne({ email });
       if (existingChef) {
           return res.status(400).json({ message: "Chef already exists" });
       }

      
       // ✅ Create and save the new chef
       const newChef = new ChefModel({
           name,
           Address,
           city,
           state,
           area,
           country,
           pincode,
           email,
           phone,
           experience,
           profilepic,
           default_cook_image,
           verified,
           starRating,
           totalRatings,
           language,
           veg,
           nonVeg,
           aboutCook,
           cuisineRatings,
           availableLocations,
           availability,
           housesServed
       });

       await newChef.save();

       res.status(201).json({
           message: "Chef created successfully",
           data: newChef
       });

   } catch (error) {
       console.error("Error:", error);
       res.status(500).json({ message: "Internal server error" });
   }
};

// Get all chefs
const getAllChef = async (req, res) => {
    try {
        const chefs = await ChefModel.find();
        res.status(200).json({
            message: "Chefs fetched successfully",
            data: chefs
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Get chef by ID
const getById = async (req, res) => {
    try {
        const { id } = req.params;
        const chef = await ChefModel.findById(id);
        if (!chef) {
            return res.status(404).json({ message: "Chef not found" });
        }
        res.status(200).json({
            message: "Chef fetched successfully",
            data: chef
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Update chef
const updateChef = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            Address,
            profilepic,
            default_cook_image,
            city,
            state,
            area,
            country,
            pincode,
            email,
            phone,
            experience,
            verified,
            starRating,
            totalRatings,
            language,
            veg,
            nonVeg,
            aboutCook,
            cuisineRatings,
            availableLocations,
            availability,
            housesServed
        } = req.body;

        let profilepicUrl = profilepic;
        if (profilepic && profilepic.startsWith("data:")) {
            const uploadResult = await cloudinary.uploader.upload(profilepic, {
                folder: "Chef"
            });
            profilepicUrl = uploadResult.secure_url;
        }

        const updatedChef = await ChefModel.findByIdAndUpdate(
            id,
            {
                name,
                Address,
                city,
                state,
                area,
                country,
                pincode,
                email,
                phone,
                experience,
                profilepic: profilepicUrl,
                default_cook_image,
                verified,
                starRating,
                totalRatings,
                language,
                veg,
                nonVeg,
                aboutCook,
                cuisineRatings,
                availableLocations,
                availability,
                housesServed
            },
            { new: true }
        );

        if (!updatedChef) {
            return res.status(404).json({ message: "Chef not found" });
        }

        res.status(200).json({
            message: "Chef updated successfully",
            data: updatedChef
        });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete chef by ID
const deleteCheftById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const chef = await ChefModel.findById(id);
        if (!chef) {
            return res.status(404).json({ message: "Chef not found" });
        }

        await ChefModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Chef deleted successfully" });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Delete all chefs
const DeleteAllChef = async (req, res) => {
    try {
        await ChefModel.deleteMany();
        res.status(200).json({
            message: "All chefs deleted successfully"
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    createChef,
    getAllChef,
    getById,
    updateChef,
    deleteCheftById,
    DeleteAllChef
};