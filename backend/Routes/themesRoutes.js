const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createTheme,
  getAllThemes,
  getThemeById,
  updateTheme,
  deleteTheme,
  getImage,
} = require("../Controller/themesController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: path.join(__dirname, "..", "temp") }); // Temporary upload folder

// Routes with unique names
router.post("/create-theme", upload.array("images"), createTheme); // Create a new theme with file upload
router.get("/get-all-themes", getAllThemes); // Retrieve all themes
router.get("/get-theme/:themeId", getThemeById); // Retrieve a theme by ID
router.put("/update-theme/:themeId", upload.array("images"), updateTheme); // Update a theme with file upload
router.delete("/delete-theme/:themeId", deleteTheme); // Delete a theme by ID
router.get("/get-image", getImage); // Serve an image by theme name and file name

module.exports = router;
