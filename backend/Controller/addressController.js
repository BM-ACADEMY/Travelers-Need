const Address = require("../Models/addressModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up multer for dynamic state image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const stateName = req.body.state
      ? req.body.state.toLowerCase().replace(/ /g, "_")
      : "default";
    const uploadPath = path.join("uploads", "states", stateName);
    fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// Get all addresses
const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};
const getAllAddressesWithCategories = async (req, res) => {
  try {
    const addresses = await Address.aggregate([
      {
        $lookup: {
          from: "packages", // The collection name of the Package model
          localField: "_id", // The field in the Address collection
          foreignField: "addressId", // The field in the Package collection
          as: "packages", // The name of the array field in the result
        },
      },
      {
        $match: {
          packages: { $ne: [] }, // Only include addresses that have at least one package
        },
      },
      {
        $group: {
          _id: "$type", // Group by the `type` field (domestic or international)
          addresses: {
            $push: {
              _id: "$_id",
              country: "$country",
              state: "$state",
              city: "$city",
              description: "$description",
              stateImage: "$stateImage",
              startingPrice: "$startingPrice",
              packages: {
                $map: {
                  input: "$packages",
                  as: "package",
                  in: {
                    _id: "$$package._id",
                    name: "$$package.name",
                    price: "$$package.price",
                    duration: "$$package.duration",
                    inclusions: "$$package.inclusions",
                    images: "$$package.images",
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0, // Remove the `_id` field from the group result
          category: "$_id", // Rename `_id` to `category`
          addresses: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Addresses with valid packages categorized successfully",
      data: addresses,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};


// Get address by filters (country, state, city)
const getAddressByFilters = async (req, res) => {
  const { country, state, city } = req.query;

  try {
    const query = {};
    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;

    const addresses = await Address.find(query);
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch addresses", error });
  }
};

// Create a new address with image upload
const createAddress = async (req, res) => {
  const { country, state, city, description, type, startingPrice } = req.body;
  const stateImage = req.file ? req.file.path : null;

  // Validate required fields
  if (!country || !state || !city || !description || !type || startingPrice === undefined) {
    return res.status(400).json({ message: "All fields are required, including startingPrice" });
  }

  // Validate that startingPrice is a non-negative number
  if (isNaN(startingPrice) || startingPrice < 0) {
    return res.status(400).json({ message: "Starting price must be a non-negative number" });
  }

  try {
    // Create a new Address document
    const newAddress = new Address({
      country,
      state,
      city,
      description,
      type,
      stateImage,
      startingPrice: Number(startingPrice), // Convert startingPrice to a number
    });

    // Save to the database
    await newAddress.save();

    res.status(201).json({
      message: "Address created successfully",
      address: newAddress,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create address",
      error: error.message,
    });
  }
};



// Update an existing address by ID with image upload
const updateAddress = async (req, res) => {
  const { id } = req.params;
  const stateImage = req.file ? req.file.path : null;

  try {
    const updateData = { ...req.body };
    if (stateImage) updateData.stateImage = stateImage;

    const updatedAddress = await Address.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Run schema validations
    });

    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ message: "Failed to update address", error });
  }
};

// Delete an address by ID
const deleteAddress = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedAddress = await Address.findByIdAndDelete(id);

    if (!deletedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Delete the associated image file if it exists
    if (deletedAddress.stateImage && fs.existsSync(deletedAddress.stateImage)) {
      fs.unlinkSync(deletedAddress.stateImage);
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete address", error });
  }
};

// Serve the image file dynamically based on state and file name
const getImage = (req, res) => {
  const { stateName, fileName } = req.query;
  const filePath = path.join("uploads", "states", stateName.toLowerCase(), fileName);

  if (fs.existsSync(filePath)) {
    return res.status(200).sendFile(path.resolve(filePath));
  }

  res.status(404).json({ message: "Image not found" });
};

module.exports = {
  createAddress: [upload.single("stateImage"), createAddress],
  getAllAddresses,
  getAddressByFilters,
  updateAddress: [upload.single("stateImage"), updateAddress],
  deleteAddress,
  getImage,
  getAllAddressesWithCategories
};
