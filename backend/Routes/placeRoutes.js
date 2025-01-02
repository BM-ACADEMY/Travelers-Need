const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createPlace,
  getAllCities,
  getSubPlaces,
  updatePlace,
  deletePlace,
} = require("../Controller/placeController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: path.join(__dirname, "..", "temp") });

// Routes for cities and sub-places
router.post("/create-place", upload.array("images"), createPlace); // Create city or sub-place
router.get("/get-all-cities", getAllCities); // Get all cities
router.get("/get-sub-places/:cityId", getSubPlaces); // Get all sub-places for a city
router.put("/update-place/:placeId", upload.array("images"), updatePlace); // Update a place
router.delete("/delete-place/:placeId", deletePlace); // Delete a place

module.exports = router;
