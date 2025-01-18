const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createPlace,
  getCityDetails,
  getSubPlaceByName,
  updatePlace,
  deletePlace,
  getPopularDestinations,
  getImage,
  getCityDataByName,
  getAllCities,
  getSubCitiesByCityName
} = require("../Controller/placeController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: path.join(__dirname, "..", "temp") });

// Routes for cities and sub-places
router.post("/create-place", upload.array("images"), createPlace); // Create city or sub-place
router.get("/details", getCityDetails); // Get all cities
router.get("/get-city-details-by-name", getCityDataByName); // Get all cities
router.get("/get-all-cities", getAllCities); // Get all cities
router.get("/get-sub-cities-by-cityName", getSubCitiesByCityName);
router.get("/get-all-popular-place", getPopularDestinations); // Get all cities
router.get("/get-sub-places", getSubPlaceByName); // Get all sub-places for a city
router.put("/update-place/:placeId", upload.array("images"), updatePlace); 
router.delete("/delete-place/:placeId", deletePlace); 
router.get("/get-image", getImage);
module.exports = router;
