const express = require("express");
const {
  createAddress,
  getAllAddresses,
  getAddressByFilters,
  updateAddress,
  deleteAddress,
  getImage,
  getAllAddressesWithCategories
} = require("../Controller/addressController");

const router = express.Router();

// Create a new address with dynamic image upload
router.post("/create", createAddress);

// Get all addresses
router.get("/all", getAllAddresses);

// Get addresses by filters
router.get("/filter", getAddressByFilters);
router.get("/get-all-addresses-with-packages", getAllAddressesWithCategories);

// Update an address by ID
router.put("/update/:id", updateAddress);

// Delete an address by ID
router.delete("/delete/:id", deleteAddress);

// Serve an image by state name and file name
router.get("/image", getImage);

module.exports = router;
