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
    console.log(req.body);
    

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
// exports.createAddress = async (req, res) => {
//   try {
//     const { country, state, city, description, startingPrice, coordinates } = req.body;
//     console.log("Request body:", req.body);

//     // Parse country, state, and city if they are strings
//     let parsedCountry, parsedState, parsedCity;
//     try {
//       parsedCountry = typeof country === "string" ? JSON.parse(country) : country;
//       parsedState = typeof state === "string" ? JSON.parse(state) : state;
//       parsedCity = typeof city === "string" ? JSON.parse(city) : city;
//     } catch (err) {
//       return res.status(400).json({ message: "Invalid JSON format for country, state, or city." });
//     }

//     // Validate required fields
//     if (!parsedCountry || !parsedState || !parsedCity || !description || !startingPrice) {
//       return res.status(400).json({ message: "Missing required fields." });
//     }

//     if (!parsedCountry.id || !parsedCountry.name || !parsedState.id || !parsedState.name || !parsedCity.id || !parsedCity.name) {
//       return res.status(400).json({ message: "Incomplete country, state, or city details." });
//     }

//     // Validate and parse coordinates
//     let parsedCoordinates;
//     try {
//       parsedCoordinates = typeof coordinates === "string" ? JSON.parse(coordinates) : coordinates;
//       if (!Array.isArray(parsedCoordinates) || parsedCoordinates.length !== 2 || 
//           isNaN(parsedCoordinates[0]) || isNaN(parsedCoordinates[1])) {
//         throw new Error();
//       }
//     } catch (err) {
//       return res.status(400).json({ message: "Invalid coordinates format. Expected [latitude, longitude]." });
//     }

//     // Create a folder for the state
//     const stateFolder = path.join(UPLOADS_ROOT, parsedState.name.replace(/\s+/g, "_").toLowerCase());
//     try {
//       await fs.ensureDir(stateFolder);
//     } catch (err) {
//       return res.status(500).json({ message: "Failed to create directory for state." });
//     }

//     // Handle image uploads
//     const images = [];
//     if (req.files && req.files.length > 0) {
//       const allowedFileTypes = ['.jpg', '.jpeg', '.png'];
//       const maxFileSize = 5 * 1024 * 1024; // 5 MB

//       for (const file of req.files) {
//         const fileExtension = path.extname(file.originalname).toLowerCase();
//         if (!allowedFileTypes.includes(fileExtension)) {
//           return res.status(400).json({ message: `Invalid file type: ${file.originalname}` });
//         }
//         if (file.size > maxFileSize) {
//           return res.status(400).json({ message: `File too large: ${file.originalname}` });
//         }

//         const timestamp = Date.now();
//         const newFileName = `${file.fieldname}-${timestamp}${fileExtension}`;
//         const destinationPath = path.join(stateFolder, newFileName);

//         try {
//           await fs.move(file.path, destinationPath);
//         } catch (err) {
//           return res.status(500).json({ message: `Failed to save file: ${file.originalname}` });
//         }

//         images.push(path.relative(UPLOADS_ROOT, destinationPath));
//       }
//     }

//     // Create and save address
//     const newAddress = new Address({
//       country: parsedCountry,
//       state: parsedState,
//       city: parsedCity,
//       description,
//       images,
//       startingPrice: parseFloat(startingPrice),
//       coordinates: parsedCoordinates,
//     });

//     await newAddress.save();
//     res.status(201).json({ message: "Address created successfully", address: newAddress });
//   } catch (error) {
//     console.error("Error creating address:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };



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

exports.getAllAddressesforAdminAddress = async (req, res) => {
  try {
    const { page = 1, limit = 10, country, state, city } = req.query;

    // Build the query object dynamically based on filters
    const query = {};
    if (country) query.country = { $regex: new RegExp(country, 'i') }; // Case-insensitive
    if (state) query.state = { $regex: new RegExp(state, 'i') };
    if (city) query.city = { $regex: new RegExp(city, 'i') };

    // Get total count for pagination metadata
    const totalRecords = await Address.countDocuments(query);

    // Fetch paginated and filtered addresses
    const addresses = await Address.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    // Transform the results
    const transformedAddresses = addresses.map((address) => {
      if (address.city && address.coordinates && address.startingPrice) {
        return {
          cityName: address.city,
          stateName:address.state,
          countryName:address.country,
          description:address.description,
          coordinates: address.coordinates.map((coord) => parseFloat(coord)),
          startingPrice: address.startingPrice,
          images:address.images,
          id:address._id
        };
      } else {
        console.log('Skipping record due to missing fields:', address);
        return null;
      }
    }).filter((record) => record !== null);

    // Respond with paginated results and metadata
    res.json({
      message: 'All addresses retrieved successfully',
      metadata: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: parseInt(page),
        limit: parseInt(limit),
      },
      addresses: transformedAddresses,
    });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getAddressForPlaces = async (req, res) => {
  try {
    const addresses = await Address.find();
    console.log(`Fetched addresses:`, addresses);

    // Extract unique states and cities
    const states = [];
    const cities = [];

    addresses.forEach(address => {
      if (address.state && address._id) {
        // Check if the state is already added
        if (!states.some(state => state.stateName === address.state)) {
          states.push({
            stateName: address.state,
            _id: address._id
          });
        }
      }

      if (address.city && address._id) {
        cities.push({
          cityName: address.city,
          _id: address._id
        });
      }
    });

    res.json({
      message: "Addresses grouped successfully",
      states,
      cities
    });
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
    const { addressId } = req.params;
    const updatedData = req.body;

    // Fetch the current address from the database to get existing images
    const currentAddress = await Address.findById(addressId);
    if (!currentAddress) {
      return res.status(404).json({ message: "Address not found." });
    }

    // If no new files are uploaded, retain the existing images
    if (req.files && req.files.length > 0) {
      const stateFolder = await createDynamicFolder(req.body.state || "default");
      const images = [];
      for (const file of req.files) {
        const timestamp = Date.now();
        const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
        const destinationPath = path.join(stateFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
      updatedData.images = images; // Update the images if new files are uploaded
    } else {
      // If no new images are provided, retain the old images
      updatedData.images = currentAddress.images;
    }

    // Update the address with the new data
    const updatedAddress = await Address.findByIdAndUpdate(addressId, updatedData, { new: true });
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
    const { addressId } = req.params;

    // Corrected method call: findByIdAndDelete
    const address = await Address.findByIdAndDelete(addressId);

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
