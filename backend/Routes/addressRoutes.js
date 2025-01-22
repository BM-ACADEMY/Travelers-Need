const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createAddress,
  getAllAddresses,
  getAddressByFilters,
  updateAddress,
  deleteAddress,
  getImage,
  getAllAddressesWithCategories,
  getAllAddressesForTourType,
  getAddressForPlaces,
  getAllAddressesforAdminAddress
} = require("../Controller/addressController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: path.join(__dirname, "..", "temp") }); // Temporary folder for uploads

// Routes with unique names
router.post("/create-address", upload.array("images"), createAddress); // Create a new address
router.get("/get-all-addresses", getAllAddresses); // Get all addresses
router.get("/get-all-addresses-for-admin-page", getAllAddressesforAdminAddress); // Get all addresses
router.get("/get-all-addresses-for-places", getAddressForPlaces); // Get all addresses
router.get("/get-all-addresses-tour-type", getAllAddressesForTourType); // Get all addresses
router.get("/get-addresses-by-filters", getAddressByFilters); // Get addresses filtered by query
router.get("/get-addresses-with-packages", getAllAddressesWithCategories); // Get addresses with associated packages
router.put("/update-address/:addressId", upload.array("images"), updateAddress); // Update an address by ID
router.delete("/delete-address/:addressId", deleteAddress); // Delete an address by ID
router.get("/get-image", getImage); // Serve an image by state name and file name

module.exports = router;
