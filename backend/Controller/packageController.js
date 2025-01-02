const Package = require('../Models/placeModel');
const Theme = require('../Models/themesModel');
const Address = require('../Models/addressModel'); 
const express = require('express');
const path = require('path');
const fs = require('fs');

// **POST**: Create a new package
// const createPackage = async (req, res) => {
//   try {
//     const {
//       name,
//       themeId,
//       userId,
//       price,
//       duration,
//       inclusions,
//       packageDescription,
//       categories,
//       addressId, // Reference Address model
//       bestMonth,
//     } = req.body;

//     // Parse categories and inclusions (if sent as JSON strings)
//     const parsedCategories = categories ? JSON.parse(categories) : ['normal'];
//     const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];

//     // Handle uploaded images
//     let imagePaths = [];
//     if (req.files) {
//       imagePaths = req.files.map((file) => file.path); // Store file paths
//     }

//     // Create a new package
//     const newPackage = new Package({
//       name,
//       themeId,
//       userId,
//       price,
//       duration,
//       inclusions: parsedInclusions,
//       images: imagePaths,
//       packageDescription,
//       categories: parsedCategories,
//       addressId, // Use the addressId reference
//       bestMonth,
//     });

//     // Save to the database
//     await newPackage.save();

//     res.status(201).json({
//       message: 'Package created successfully',
//       package: newPackage,
//     });
//   } catch (error) {
//     res.status(400).json({
//       error: 'Error creating package',
//       details: error.message,
//     });
//   }
// };
const createPackage = async (req, res) => {
  console.log(req.body);
  
  try {
    const {
      name,
      themeId,
      userId,
      price,
      tripDuration,
      packageDescription,
      categories,
      addressId, // Reference Address model
      bestMonth,
      country,
      state,
      nearestCity,
      bestToVisitCity,
      peakSeason,
      networkSettings, // Nested schema for network settings
      howToReach, // Array of transport details
      bestTimeToVisit, // Nested schema for weather information
      inclusions,
    } = req.body;

    // Parse categories, inclusions, networkSettings, howToReach, and bestTimeToVisit (if sent as JSON strings)
    const parsedCategories = categories ? JSON.parse(categories) : ['normal'];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];
    const parsedNetworkSettings = networkSettings
      ? JSON.parse(networkSettings)
      : {};
    const parsedHowToReach = howToReach ? JSON.parse(howToReach) : [];
    const parsedBestTimeToVisit = bestTimeToVisit
      ? JSON.parse(bestTimeToVisit)
      : {};

    // Handle uploaded images
    let imagePaths = [];
    if (req.files) {
      imagePaths = req.files.map((file) => file.path); // Store file paths
    }

    // Create a new package
    const newPackage = new Package({
      name,
      themeId,
      userId,
      price,
      tripDuration,
      country,
      state,
      nearestCity,
      bestToVisitCity,
      peakSeason,
      inclusions: parsedInclusions,
      images: imagePaths,
      packageDescription,
      categories: parsedCategories,
      addressId,
      bestMonth,
      networkSettings: parsedNetworkSettings, // Add nested network settings schema
      howToReach: parsedHowToReach, // Add nested transport details array
      bestTimeToVisit: parsedBestTimeToVisit, // Add nested weather information schema
    });

    // Save to the database
    const savedPackage = await newPackage.save();

    res.status(201).json({
      message: 'Package created successfully',
      package: savedPackage,
    });
  } catch (error) {
    console.error('Error creating package:', error);
    res.status(400).json({
      error: 'Error creating package',
      details: error.message,
    });
  }
};

// **GET**: Get all packages
const getAllPackages = async (req, res) => {
  try {
    const packages = await Package.find()
      .populate('themeId', 'name') // Populate theme details
      .populate('userId', 'username email') // Populate user details
      .populate('addressId', 'country state city'); // Populate address details

    if (!packages || packages.length === 0) {
      return res.status(404).json({ error: 'No packages found' });
    }

    res.status(200).json({
      message: 'Packages fetched successfully',
      data: packages,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving packages',
      details: error.message,
    });
  }
};

// **GET**: Get filtered packages
// const getFilteredPackages = async (req, res) => {
//   try {
//     const packages = await Package.find()
//       .populate('themeId', 'name') // Populate theme details
//       .populate('addressId', 'country state city'); // Populate address details

//     if (!packages || packages.length === 0) {
//       return res.status(404).json({ error: 'No packages found' });
//     }

//     // Group packages by address (state and city)
//     const groupedPackages = {};
//     packages.forEach((pkg) => {
//       const address = pkg.addressId;
//       if (!address) return;

//       const stateKey = address.state;
//       if (!groupedPackages[stateKey]) {
//         groupedPackages[stateKey] = {};
//       }

//       const cityKey = address.city;
//       if (!groupedPackages[stateKey][cityKey]) {
//         groupedPackages[stateKey][cityKey] = [];
//       }

//       groupedPackages[stateKey][cityKey].push(pkg);
//     });

//     res.status(200).json({
//       message: 'Filtered packages fetched successfully',
//       data: groupedPackages,
//     });
//   } catch (error) {
//     res.status(500).json({
//       error: 'Error filtering packages',
//       details: error.message,
//     });
//   }
// };
const getFilteredPackages = async (req, res) => {
  try {
    const categories = {
      TRENDING: 'trending',
      TOP: 'top destination',
      THEMES: ['HONEYMOON', 'WILDLIFE', 'HILLSTATIONS', 'PILGRIMAGE', 'HERITAGE', 'BEACH'],
    };

    // Fetch all packages and populate related fields
    const packages = await Package.find()
      .populate('themeId', 'name') // Populate theme details
      .populate('addressId', 'country state city description type stateImage startingPrice') // Populate address details
      .populate('userId', 'username email'); // Populate user details

    if (!packages || packages.length === 0) {
      return res.status(404).json({ error: 'No packages found' });
    }

    // Initialize grouped response
    const groupedCategories = {};

    // Helper function to group packages by state and city
    const groupByStateAndCity = (filteredPackages) => {
      const grouped = {};

      filteredPackages.forEach((pkg) => {
        const address = pkg.addressId;

        // Skip packages without an addressId
        if (!address) return;

        const stateKey = address.state;
        if (!grouped[stateKey]) {
          grouped[stateKey] = {
            stateName: stateKey,
            stateDetails: {
              description: address.description,
              country: address.country,
              type: address.type,
              stateImage: address.stateImage,
              startingPrice: address.startingPrice || Infinity,
            },
            cities: {},
          };
        }

        const cityKey = address.city;
        if (!grouped[stateKey].cities[cityKey]) {
          grouped[stateKey].cities[cityKey] = [];
        }

        grouped[stateKey].cities[cityKey].push({
          packageId: pkg._id,
          name: pkg.name,
          theme: pkg.themeId ? pkg.themeId.name : null,
          user: pkg.userId ? { username: pkg.userId.username, email: pkg.userId.email } : null,
          price: pkg.price,
          duration: pkg.duration,
          inclusions: pkg.inclusions,
          images: pkg.images,
          description: pkg.packageDescription,
          bestMonth: pkg.bestMonth,
        });

        // Update the state's starting price with the lowest package price
        grouped[stateKey].stateDetails.startingPrice = Math.min(
          grouped[stateKey].stateDetails.startingPrice,
          pkg.price
        );
      });

      // Add city count for each state
      Object.keys(grouped).forEach((state) => {
        grouped[state].cityCount = Object.keys(grouped[state].cities).length;
      });

      return grouped;
    };

    // Group packages for TRENDING category
    const trendingPackages = packages.filter((pkg) => pkg.categories.includes(categories.TRENDING));
    groupedCategories['TRENDING_DESTINATIONS'] = groupByStateAndCity(trendingPackages);

    // Group packages for TOP DESTINATION category
    const topDestinationPackages = packages.filter((pkg) => pkg.categories.includes(categories.TOP));
    groupedCategories['TOP_DESTINATIONS'] = groupByStateAndCity(topDestinationPackages);

    // Group packages for each theme
    categories.THEMES.forEach((themeName) => {
      const themePackages = packages.filter(
        (pkg) => pkg.themeId && pkg.themeId.name.toUpperCase() === themeName
      );
      groupedCategories[`${themeName.toUpperCase()}_DESTINATIONS`] = groupByStateAndCity(themePackages);
    });

    res.status(200).json({
      message: 'Packages grouped by categories fetched successfully',
      data: groupedCategories,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching packages by categories',
      details: error.message,
    });
  }
};
const getCitiesByState = async (req, res) => {
  try {
    const { stateName } = req.params;

    // Fetch state details from Address collection
    const stateDetails = await Address.findOne({ state: stateName }).select(
      'state country description type stateImage startingPrice'
    );

    if (!stateDetails) {
      return res.status(404).json({ error: `State details not found for: ${stateName}` });
    }

    // Fetch packages with matching stateName
    const packages = await Package.find()
      .populate('addressId', 'state city country description')
      .populate('themeId', 'name')
      .populate('userId', 'username email');

    // Filter packages by the stateName
    const filteredPackages = packages.filter(
      (pkg) => pkg.addressId && pkg.addressId.state === stateName
    );

    if (!filteredPackages.length) {
      return res.status(404).json({ error: `No packages found for state: ${stateName}` });
    }

    // Group packages by cities
    const groupedCities = {};
    filteredPackages.forEach((pkg) => {
      const cityName = pkg.addressId.city;
      if (!groupedCities[cityName]) {
        groupedCities[cityName] = [];
      }

      groupedCities[cityName].push({
        packageId: pkg._id,
        name: pkg.name,
        theme: pkg.themeId?.name,
        user: pkg.userId ? { username: pkg.userId.username, email: pkg.userId.email } : null,
        price: pkg.price,
        duration: pkg.duration,
        inclusions: pkg.inclusions,
        images: pkg.images,
        description: pkg.packageDescription,
        bestMonth: pkg.bestMonth,
      });
    });

    res.status(200).json({
      message: `Packages grouped by cities for state: ${stateName}`,
      stateDetails: {
        stateName: stateDetails.state,
        description: stateDetails.description,
        country: stateDetails.country,
        type: stateDetails.type,
        stateImage: stateDetails.stateImage,
        startingPrice: stateDetails.startingPrice,
      },
      cities: groupedCities,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error fetching cities by state',
      details: error.message,
    });
  }
};
const getTopDestinationPackagesGroupedByState = async (req, res) => {
  try {
    // Step 1: Fetch all valid addresses from the Address collection
    const validAddresses = await Address.find({}, "_id country state city description type stateImage startingPrice");

    if (!validAddresses || validAddresses.length === 0) {
      return res.status(404).json({ error: "No valid addresses found" });
    }

    // Create a lookup for addresses by their ID
    const addressLookup = validAddresses.reduce((acc, address) => {
      acc[address._id.toString()] = address;
      return acc;
    }, {});

    // Step 2: Find packages with "top destination" and a valid addressId
    const topDestinationPackages = await Package.find({
      categories: "top destination", // Filter for top destination category
      addressId: { $in: Object.keys(addressLookup) }, // Ensure the addressId exists in the valid addresses
    })
      .populate("themeId", "name") // Populate theme details
      .populate("userId", "username email"); // Populate user details

    if (!topDestinationPackages || topDestinationPackages.length === 0) {
      return res.status(404).json({ error: "No top destination packages with valid address found" });
    }

    // Group packages by state and city
    const groupedPackages = {};

    topDestinationPackages.forEach((pkg) => {
      const address = addressLookup[pkg.addressId.toString()];
      if (!address) return;

      const stateKey = address.state;

      if (!groupedPackages[stateKey]) {
        groupedPackages[stateKey] = {
          stateDetails: {
            state: address.state,
            country: address.country,
            city:address.city,
            description: address.description,
            type: address.type,
            stateImage: address.stateImage,
            startingPrice: address.startingPrice,
          },
          cities: {},
        };
      }

      const cityKey = address.city;
      if (!groupedPackages[stateKey].cities[cityKey]) {
        groupedPackages[stateKey].cities[cityKey] = [];
      }

      groupedPackages[stateKey].cities[cityKey].push({
        packageId: pkg._id,
        name: pkg.name,
        theme: pkg.themeId ? pkg.themeId.name : null,
        user: pkg.userId
          ? { username: pkg.userId.username, email: pkg.userId.email }
          : null,
        price: pkg.price,
        duration: pkg.duration,
        inclusions: pkg.inclusions,
        images: pkg.images,
        description: pkg.packageDescription,
        bestMonth: pkg.bestMonth,
      });

      // Update the state's starting price if this package has a lower price
      groupedPackages[stateKey].stateDetails.startingPrice = Math.min(
        groupedPackages[stateKey].stateDetails.startingPrice,
        pkg.price
      );
    });

    res.status(200).json({
      message: "Top destination packages grouped by state and city fetched successfully",
      data: groupedPackages,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error fetching top destination packages grouped by state and city",
      details: error.message,
    });
  }
};

// **GET**: Retrieve a single package by ID
const getPackageById = async (req, res) => {
  try {
    const { packageId } = req.params;
    console.log(packageId);
    
    const package = await Package.findById(packageId)
      .populate("addressId", "state city country description")
      .populate("userId", "username email")
      .populate("themeId", "name");

    if (!package) {
      return res.status(404).json({ error: "Package not found" });
    }

    res.status(200).json(package);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving package", details: error.message });
  }
};
const getPackageByIdWithFilter = async (req, res) => {
  try {
    const { packageId } = req.params;
    const { type } = req.query;

    // Find the package by ID and populate necessary fields
    const package = await Package.findById(packageId)
      .populate("addressId", "state city country description")
      .populate("userId", "username email")
      .populate("themeId", "name");

    if (!package) {
      return res.status(404).json({
        message: "Package not found",
        data: null,
      });
    }

    // Filter data based on the requested type
    let responseData = {};
    switch (type) {
      case "overview":
        responseData = {
          name: package.name,
          theme: package.themeId?.name,
          user: package.userId,
          price: package.price,
          tripDuration: package.tripDuration,
          nearestCity: package.nearestCity,
          peakSeason: package.peakSeason,
          packageDescription: package.packageDescription,
          networkSettings: package.networkSettings,
          address: package.addressId,
          inclusions: package.inclusions,
          categories: package.categories,
          images: package.images,
        };
        break;

      case "top-places":
        responseData = {
          topPlaces: package.categories.includes("top destination")
            ? package.categories
            : [],
        };
        break;

      case "best-places":
        responseData = {
          bestPlaces: package.categories.includes("trending")
            ? package.categories
            : [],
        };
        break;

      case "best-time":
        responseData = {
          bestTimeToVisit: package.bestTimeToVisit,
        };
        break;

      case "how-to-reach":
        responseData = {
          howToReach: package.howToReach,
        };
        break;

      default:
        return res.status(400).json({
          message: "Invalid request type",
          data: null,
        });
    }

    res.status(200).json({
      message: "Packages fetched successfully",
      data: responseData,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving package",
      details: error.message,
    });
  }
};

// **PUT**: Update a package
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      themeId,
      userId,
      price,
      duration,
      inclusions,
      packageDescription,
      categories,
      addressId,
      bestMonth,
    } = req.body;

    const parsedCategories = categories ? JSON.parse(categories) : [];
    const parsedInclusions = inclusions ? JSON.parse(inclusions) : [];

    // Find the existing package
    const existingPackage = await Package.findById(id);
    if (!existingPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    // Define the package folder path
    const packageFolder = path.resolve('uploads', 'packages', existingPackage.name);

    // Remove all existing files in the package folder if the folder exists
    if (fs.existsSync(packageFolder)) {
      const files = fs.readdirSync(packageFolder); // Get all files in the folder
      files.forEach((file) => {
        const filePath = path.join(packageFolder, file);
        fs.unlinkSync(filePath); // Delete each file
      });
    } else {
      // If the folder doesn't exist, create it
      fs.mkdirSync(packageFolder, { recursive: true });
    }

    // Handle new files
    const updatedImages = [];
    if (req.files) {
      req.files.forEach((file) => {
        const newImagePath = file.path;
        updatedImages.push(newImagePath); // Add new file paths to the images array
      });
    }

    // Update the package in the database
    const updatedPackage = await Package.findByIdAndUpdate(
      id,
      {
        name,
        themeId,
        userId,
        price,
        duration,
        inclusions: parsedInclusions,
        images: updatedImages,
        packageDescription,
        categories: parsedCategories,
        addressId,
        bestMonth,
      },
      { new: true, runValidators: true } // Return the updated document and validate fields
    );

    res.status(200).json({
      message: 'Package updated successfully',
      package: updatedPackage,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error updating package',
      details: error.message,
    });
  }
};

// **DELETE**: Delete a package by ID
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPackage = await Package.findByIdAndDelete(id);

    if (!deletedPackage) {
      return res.status(404).json({ error: 'Package not found' });
    }

    res.status(200).json({
      message: 'Package deleted successfully',
      package: deletedPackage,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting package',
      details: error.message,
    });
  }
};

// **GET**: Retrieve an image
const getImage = async (req, res) => {
  try {
    const { packageName, fileName } = req.query; // Extract from query parameters

    if (!packageName || !fileName) {
      return res.status(400).json({ error: 'Both packageName and fileName are required' });
    }

    // Construct the file path dynamically
    const filePath = path.resolve('uploads','packages',packageName,fileName);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      return res.status(200).sendFile(filePath); // Serve the image file
    }

    // File not found
    res.status(404).json({ error: 'Image not found' });
  } catch (error) {
    // Handle unexpected errors
    res.status(500).json({
      error: 'An error occurred while retrieving the image',
      details: error.message,
    });
  }
};


module.exports = {
  createPackage,
  getAllPackages,
  getFilteredPackages,
  getCitiesByState,
  getPackageById,
  updatePackage,
  deletePackage,
  getImage,
  getTopDestinationPackagesGroupedByState,
  getPackageByIdWithFilter
};



