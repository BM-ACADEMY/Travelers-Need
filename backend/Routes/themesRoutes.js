const express = require('express');
const {
  createTheme,
  getAllThemes,
  getThemeById,
  updateTheme,
  deleteTheme,
  getImageByPath,
  getImageByQuery,
  getThemeDetailsWithStatesAndCities,
} = require('../Controller/themesController');

const router = express.Router();

// Route to create a new theme
router.post('/create-theme', createTheme);

// Route to get all themes
router.get('/get-all-themes', getAllThemes);

// Route to get a theme by ID
router.get('/get-theme-by-id/:id', getThemeById);

// Route to update a theme
router.put('/update-theme', updateTheme);

// Route to delete a theme by ID
router.delete('/delete-theme/:id', deleteTheme);

// Route to get an image by themeName and fileName (query parameters)
router.get('/get-image-by-query', getImageByQuery);
//getby themename
router.get('/get-state-city-by-themename/:themename', getThemeDetailsWithStatesAndCities);

// Route to get an image by themeName and fileName (path parameters)
router.get('/get-image-by-path/:themeName/:fileName', getImageByPath);

module.exports = router;
