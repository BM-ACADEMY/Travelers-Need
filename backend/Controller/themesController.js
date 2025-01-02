const Theme = require("../Models/themesModel");
const fs = require("fs-extra");
const path = require("path");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "themes");

// Helper function: Create theme folder dynamically
const createThemeFolder = async (themeName) => {
  const themeFolder = path.join(UPLOADS_ROOT, themeName);
  await fs.ensureDir(themeFolder); // Ensure directory exists
  return themeFolder;
};

// 1. Create a new theme with dynamic file upload
exports.createTheme = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Create theme folder dynamically
    const themeFolder = await createThemeFolder(name);

    // Rename and move uploaded files
    const images = [];
    if (req.files) {
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
      images,
    });

    await newTheme.save();
    res.status(201).json({ message: "Theme created successfully", theme: newTheme });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all themes
exports.getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find();
    res.json({ message: "All themes retrieved", themes });
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

    const updatedData = { name, description };

    // Handle file uploads
    if (req.files) {
      const themeFolder = await createThemeFolder(name || "default");
      const images = [];
      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(themeFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
      updatedData.images = images;
    }

    const updatedTheme = await Theme.findByIdAndUpdate(themeId, updatedData, { new: true });

    if (!updatedTheme) {
      return res.status(404).json({ message: "Theme not found" });
    }

    res.json({ message: "Theme updated successfully", theme: updatedTheme });
  } catch (error) {
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
