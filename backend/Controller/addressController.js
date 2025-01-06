const Address = require("../Models/addressModel");
const fs = require("fs-extra");
const path = require("path");
const TourPlan = require("../Models/tourPlanModel");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "addresses");

// Helper function: Create a dynamic folder structure for state
const createDynamicFolder = async (state) => {
  const stateFolder = path.join(UPLOADS_ROOT, state.replace(/ /g, "_"));
  await fs.ensureDir(stateFolder);
  return stateFolder;
};

// 1. Create a new address with dynamic image upload
exports.createAddress = async (req, res) => {
  try {
    const { country, state, city, description, startingPrice, coordinates } = req.body;

    // Validate coordinates
    let parsedCoordinates;
    try {
      parsedCoordinates = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
      if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2) {
        throw new Error("Coordinates must be an array of two numbers [latitude, longitude].");
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid coordinates format." });
    }

    // Create state folder dynamically
    const stateFolder = await createDynamicFolder(state);

    // Rename and move uploaded files
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const timestamp = Date.now();
        const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
        const destinationPath = path.join(stateFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
    }

    // Create a new address document
    const newAddress = new Address({
      country,
      state,
      city,
      description,
      images,
      startingPrice,
      coordinates: parsedCoordinates,
    });

    await newAddress.save();
    res.status(201).json({ message: "Address created successfully", address: newAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    console.log(`Fetched addresses:`, addresses);

    const transformedAddresses = addresses.map(address => {
      if (address.city && address.coordinates && address.startingPrice) {
        return {
          cityName: address.city,
          coordinates: address.coordinates.map(coord => parseFloat(coord)),
          startingPrice: address.startingPrice
        };
      } else {
        console.log("Skipping record due to missing fields:", address);
        return null;
      }
    }).filter(record => record !== null);

    res.json({ message: "All addresses retrieved successfully", addresses: transformedAddresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAllAddressesForTourType = async (req, res) => {
  try {
    // Fetch all addresses
    const addresses = await Address.find();
    console.log(`Fetched addresses:`, addresses);

    // Initialize containers for grouping
    const domesticAddresses = [];
    const internationalAddresses = [];

    for (const address of addresses) {
      if (address.city && address.coordinates && address.startingPrice) {
        // Check if the address is linked to a domestic or international tour plan
        const linkedTourPlans = await TourPlan.find({ addressId: address._id });

        // Determine if the address is domestic or international
        const isDomestic = linkedTourPlans.some(plan => plan.tourType === "D");
        const isInternational = linkedTourPlans.some(plan => plan.tourType === "I");

        const transformedAddress = {
          cityName: address.state,
          coordinates: address.coordinates.map(coord => parseFloat(coord)),
          startingPrice: address.startingPrice,
        };

        if (isDomestic) {
          domesticAddresses.push(transformedAddress);
        }
        if (isInternational) {
          internationalAddresses.push(transformedAddress);
        }
      } else {
        console.log("Skipping record due to missing fields:", address);
      }
    }

    // Combine results into categories
    const groupedAddresses = {
      domestic: domesticAddresses,
      international: internationalAddresses,
    };

    res.json({
      message: "Addresses grouped by state and category retrieved successfully",
      addresses: groupedAddresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Get addresses by filters
exports.getAddressByFilters = async (req, res) => {
  try {
    const filters = req.query; // Use query parameters for filtering
    const addresses = await Address.find(filters);
    res.json({ message: "Filtered addresses retrieved successfully", addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Get all addresses with packages (custom logic)
exports.getAllAddressesWithCategories = async (req, res) => {
  try {
    const addresses = await Address.aggregate([
      {
        $lookup: {
          from: "packages", // Assuming "packages" is another collection
          localField: "_id",
          foreignField: "addressId",
          as: "packages",
        },
      },
    ]);
    res.json({ message: "Addresses with categories retrieved successfully", addresses });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Update an address by ID
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Handle file uploads if provided
    if (req.files) {
      const stateFolder = await createDynamicFolder(req.body.state || "default");
      const images = [];
      for (const file of req.files) {
        const timestamp = Date.now();
        const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
        const destinationPath = path.join(stateFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
      updatedData.images = images;
    }

    const updatedAddress = await Address.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    res.json({ message: "Address updated successfully", address: updatedAddress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Delete an address by ID
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await Address.findByIdAndDelete(id);

    if (!address) {
      return res.status(404).json({ message: "Address not found." });
    }

    // Delete state folder if no other records exist for this state
    const stateFolder = path.join(UPLOADS_ROOT, address.state.replace(/ /g, "_"));
    const stateRecords = await Address.find({ state: address.state });
    if (stateRecords.length === 0) {
      await fs.remove(stateFolder);
    }

    res.json({ message: "Address deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 7. Serve an image by state name and file name
exports.getImage = async (req, res) => {
  try {
    const { state, fileName } = req.query; // Pass state and fileName as query parameters
    const filePath = path.join(UPLOADS_ROOT, state.replace(/ /g, "_"), fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
