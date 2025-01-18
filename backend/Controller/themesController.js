const Theme = require("../Models/themesModel");
const fs = require("fs-extra");
const path = require("path");
const TourPlan = require("../Models/tourPlanModel");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "themes");


const createThemeFolder = async (themeName) => {
  const themeFolder = path.join(UPLOADS_ROOT, themeName);
  await fs.ensureDir(themeFolder); // Ensure directory exists
  return themeFolder;
};
exports.getAllThemes = async (req, res) => {  
  try {
    const themes = await Theme.find(); // Fetches all themes from the collection

    res.json({ message: "Themes retrieved successfully", themes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTheme = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(req.body);

    // Validate name
    if (!Theme.schema.path("name").enumValues.includes(name)) {
      return res.status(400).json({ error: `Invalid theme name: ${name}` });
    }

    // Create theme folder dynamically
    const themeFolder = await createThemeFolder(name);

    // Rename and move uploaded files
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(themeFolder, newFileName);
        await fs.move(file.path, destinationPath); // Move file to theme folder
        images.push(path.relative(UPLOADS_ROOT, destinationPath)); // Save relative path
      }
    }

    // Create a new theme
    const newTheme = new Theme({
      name,
      description,
      themeImage: images,
    });

    await newTheme.save();
    res
      .status(201)
      .json({ message: "Theme created successfully", theme: newTheme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 2. Get all themes
exports.getAllThemesWithTourPlans = async (req, res) => {
  try {
    // Fetch all themes
    const themes = await Theme.find();

    // Fetch all tour plans
    const tourPlans = await TourPlan.find();

    // Prepare response structure
    const categories = [
      "honeymoon",
      "hillstations",
      "wildlife",
      "heritage",
      "pilgrimage",
      "beach",
    ];

    const response = [];

    for (const category of categories) {
      // Fetch themes matching the category (case-insensitive)
      const categoryThemes = themes.filter(
        (theme) => theme.name.toLowerCase() === category.toLowerCase()
      );

      const categoryData = categoryThemes.map((theme) => {
        // Match tour plans where theme ID is a string or included in themeId array
        const themeTourPlans = tourPlans.filter((plan) => {
          return (
            plan.themeId.toString() === theme._id.toString() ||
            (Array.isArray(plan.themeId) &&
              plan.themeId
                .map((id) => id.toString())
                .includes(theme._id.toString()))
          );
        });

        return {
          id: theme._id,
          name: theme.name,
          description: theme.description,
          tourPlanCount: themeTourPlans.length,
        };
      });

      response.push({
        category,
        themes: categoryData,
      });
    }

    res.json({
      message: "Themes grouped by category retrieved",
      data: response,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getThemeDetailsWithTourPlans = async (req, res) => {
  try {
    const { themename } = req.params;

    // Convert themename to lowercase
    const lowerCaseName = themename.toLowerCase();

    // Find the theme by its name (case-insensitive)
    const theme = await Theme.findOne({
      name: new RegExp(`^${lowerCaseName}$`, "i"),
    });

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    // Find all tour plans associated with the themeId
    const tourPlans = await TourPlan.find({
      themeId: {
        $in: [theme._id.toString(), theme._id], // Check for both string and ObjectId formats
      },
    });

    res.json({
      message: "Theme and tour plans retrieved successfully",
      theme: {
        _id: theme._id,
        name: theme.name,
        description: theme.description,
        themeImage: theme.themeImage,
      },
      tourPlans,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 3. Get a theme by ID
exports.getThemeById = async (req, res) => {
  try {
    const { themeId } = req.params;

    const theme = await Theme.findById(themeId);

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.json({ message: "Theme retrieved successfully", theme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 4. Update a theme by ID with new file upload
exports.updateTheme = async (req, res) => {
  try {
    const { themeId } = req.params;
    const { name, description } = req.body;

    // Validate and prepare update data
    const updatedData = {};
    if (name) updatedData.name = name;
    if (description) updatedData.description = description;

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      // Create or ensure theme folder exists
      const themeFolder = await createThemeFolder(name || "default");
      const images = [];

      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(themeFolder, newFileName);
        await fs.move(file.path, destinationPath); // Move file to theme folder
        images.push(path.relative(UPLOADS_ROOT, destinationPath)); // Save relative path
      }

      // Add images to update data
      updatedData.themeImage = images;
    }

    // Update the theme in the database
    const updatedTheme = await Theme.findByIdAndUpdate(themeId, updatedData, {
      new: true, // Return the updated document
    });

    if (!updatedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.json({ message: "Theme updated successfully", theme: updatedTheme });
  } catch (error) {
    console.error("Error updating theme:", error);
    res.status(500).json({ error: error.message });
  }
};
// 5. Delete a theme by ID
exports.deleteTheme = async (req, res) => {
  try {
    const { themeId } = req.params;

    const theme = await Theme.findByIdAndDelete(themeId);

    if (!theme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    // Optionally, delete theme folder
    const themeFolder = path.join(UPLOADS_ROOT, theme.name);
    await fs.remove(themeFolder);

    res.json({ message: "Theme deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 6. Serve an image by theme name and file name
exports.getImage = async (req, res) => {
  try {
    const { themeName, fileName } = req.query; // Query parameters: themeName and fileName
    const filePath = path.join(UPLOADS_ROOT, themeName, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
