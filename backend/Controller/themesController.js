const Theme = require('../Models/themesModel'); // Import the Theme model
const Package =require('../Models/packageModel');
const Address=require('../Models/addressModel');
const multer = require('multer');
 const path = require('path');
const fs = require('fs');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const themeName = req.body.name ? req.body.name.toUpperCase() : 'DEFAULT';
        const uploadPath = path.join('uploads', 'themes', themeName);
        fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Get all themes
const getAllThemes = async (req, res) => {
  try {
    const themesWithCounts = await Theme.aggregate([
      {
        $lookup: {
          from: "packages", // The collection name for packages
          localField: "_id", // The field in themes to match
          foreignField: "themeId", // The field in packages to match
          as: "relatedPackages", // Alias for the joined data
        },
      },
      {
        $unwind: {
          path: "$relatedPackages",
          preserveNullAndEmptyArrays: true, // Include themes with no packages
        },
      },
      {
        $lookup: {
          from: "addresses", // The collection name for addresses
          localField: "relatedPackages.addressId", // The field in packages to match with addresses
          foreignField: "_id", // The field in addresses to match
          as: "relatedAddress", // Alias for the joined data
        },
      },
      {
        $addFields: {
          isValidPackage: {
            $cond: {
              if: { $gt: [{ $size: "$relatedAddress" }, 0] }, // Check if valid address exists
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          themename: { $first: "$name" },
          description: { $first: "$description" },
          themeImage: { $first: "$themeImage" },
          packageCount: {
            $sum: { $cond: [{ $eq: ["$isValidPackage", true] }, 1, 0] }, // Count only valid packages
          },
        },
      },
      {
        $project: {
          _id: 1,
          themename: 1,
          description: 1,
          themeImage: 1,
          packageCount: 1,
        },
      },
    ]);

    // If no themes or counts, return an empty object
    if (!themesWithCounts || themesWithCounts.length === 0) {
      return res.status(200).json({
        message: "No themes available",
        data: {},
      });
    }

    // Format data as an object where each key is the theme name
    const categorizedThemes = {};
    themesWithCounts.forEach((theme) => {
      categorizedThemes[theme.themename.toUpperCase()] = {
        _id: theme._id,
        themename: theme.themename,
        description: theme.description,
        themeImage: theme.themeImage,
        packageCount: theme.packageCount,
      };
    });

    res.status(200).json({
      message: "Themes grouped by categories fetched successfully",
      data: categorizedThemes,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving themes with package counts",
      details: error.message,
    });
  }
};



  
const getThemeDetailsWithStatesAndCities = async (req, res) => {
  try {
    const { themename } = req.params;

    // Find the theme by name (case-insensitive)
    const theme = await Theme.findOne({ name: new RegExp(`^${themename}$`, 'i') });

    if (!theme) {
      return res.status(404).json({ error: `Theme '${themename}' not found` });
    }

    // Fetch packages related to the theme
    const packages = await Package.find({ themeId: theme._id })
      .populate('addressId', 'state city description country type stateImage startingPrice')
      .populate('userId', 'username email');

    console.log("Fetched packages:", packages); // Debug log

    // Filter packages with valid addressId
    const validPackages = packages.filter(pkg => pkg.addressId);

    console.log("Valid packages with addressId:", validPackages); // Debug log

    if (!validPackages.length) {
      // Return empty states if no valid packages are found
      return res.status(200).json({
        message: `No packages found for theme: ${themename}`,
        themeDetails: {
          _id: theme._id,
          themename: theme.name,
          description: theme.description,
          themeImage: theme.themeImage,
          packageCount: 0,
        },
        states: {},
      });
    }

    // Group valid packages by state and city
    const groupedStates = {};
    validPackages.forEach((pkg) => {
      const address = pkg.addressId;
      const stateKey = address.state;

      if (!groupedStates[stateKey]) {
        groupedStates[stateKey] = {
          stateName: stateKey,
          stateDetails: {
            description: address.description,
            country: address.country,
            type: address.type,
            stateImage: address.stateImage,
            startingPrice: address.startingPrice || pkg.price,
          },
          cities: {},
        };
      }

      const cityKey = address.city;
      if (!groupedStates[stateKey].cities[cityKey]) {
        groupedStates[stateKey].cities[cityKey] = [];
      }

      groupedStates[stateKey].cities[cityKey].push({
        packageId: pkg._id,
        name: pkg.name,
        theme: themename,
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
      message: `Details for theme: ${themename}`,
      themeDetails: {
        _id: theme._id,
        themename: theme.name,
        description: theme.description,
        themeImage: theme.themeImage,
        packageCount: validPackages.length, // Use valid packages count
      },
      states: groupedStates,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving theme details with states and cities',
      details: error.message,
    });
  }
};


  
// Get a theme by ID
    const getThemeById = async (req, res) => {
        try {
            const { id } = req.params;
            const theme = await Theme.findById(id);

            if (!theme) {
                return res.status(404).json({ error: 'Theme not found' });
            }

            res.status(200).json(theme);
        } catch (error) {
            res.status(500).json({ error: 'Error retrieving theme: ' + error.message });
        }
    };

// Get an image by path
const getImageByPath = (req, res) => {
    try {
        const { themeName, fileName } = req.params;
        const filePath = path.join('uploads', 'themes', themeName, fileName);
      console.log('filegeet',filePath);
      
        if (fs.existsSync(filePath)) {
            return res.status(200).sendFile(path.resolve(filePath));
        }

        res.status(404).json({ error: 'File not found' });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving file: ' + error.message });
    }
};
const getImageByQuery = (req, res) => {
  try {
      const { themeName, fileName } = req.query; // Extract from query parameters

      if (!themeName || !fileName) {
          return res.status(400).json({ error: 'Both themeName and fileName are required' });
      }

      const filePath = path.join('uploads', 'themes', themeName, fileName);

      // Check if the file exists
      if (fs.existsSync(filePath)) {
          return res.status(200).sendFile(path.resolve(filePath));
      }

      // File not found
      res.status(404).json({ error: 'File not found' });
  } catch (error) {
      res.status(500).json({ error: 'Error retrieving file: ' + error.message });
  }
};

// Create a new theme
const createTheme = async (req, res) => {
    try {
        const { name, description } = req.body;
        const themeImage = req.file ? req.file.path : null;

        if (!name) {
            return res.status(400).json({ error: 'Theme name is required' });
        }

        const newTheme = new Theme({ name, description, themeImage });
        await newTheme.save();

        res.status(201).json({ message: 'Theme created successfully', theme: newTheme });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Theme name must be unique' });
        }
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

// Update a theme by ID
const updateTheme = async (req, res) => {
  try {
    const { id } = req.query; // Extract theme ID from query parameters
    const { name, description } = req.body; // Extract form-data fields
    const themeImage = req.file ? req.file.path : null; // Get uploaded file path

    if (!id) {
        return res.status(400).json({ error: 'Theme ID is required' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (themeImage) updateData.themeImage = themeImage;

    const updatedTheme = await Theme.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedTheme) {
        return res.status(404).json({ error: 'Theme not found' });
    }

    res.status(200).json({ message: 'Theme updated successfully', theme: updatedTheme });
} catch (error) {
    res.status(400).json({ error: 'Error updating theme: ' + error.message });
}
};



// Delete a theme by ID
const deleteTheme = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTheme = await Theme.findByIdAndDelete(id);

        if (!deletedTheme) {
            return res.status(404).json({ error: 'Theme not found' });
        }

        if (deletedTheme.themeImage && fs.existsSync(deletedTheme.themeImage)) {
            fs.unlinkSync(deletedTheme.themeImage);
        }

        res.status(200).json({ message: 'Theme deleted successfully', theme: deletedTheme });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting theme: ' + error.message });
    }
};

module.exports = {
    createTheme: [upload.single('themeImage'), createTheme],
    getAllThemes,
    getThemeById,
    getImageByPath,
    updateTheme: [upload.single('themeImage'), updateTheme],
    deleteTheme,
    getImageByQuery,
    getThemeDetailsWithStatesAndCities
};
