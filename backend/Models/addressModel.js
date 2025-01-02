const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  description: { type: String, required: true },
  images: {
    type: [String], // Array of image URLs or file paths
    default: [],
    validate: {
      validator: (v) => v.every((url) => /^[^<>:;,?"*|]+$/.test(url)),
      message: "One or more image paths are invalid",
    },
  },
  startingPrice: { type: Number, required: true, min: [0, "Starting price must be non-negative"] },
  coordinates: {
    type: [Number], // Latitude, Longitude
    coordinates: {
      type: [Number], // Latitude, Longitude
      validate: {
        validator: (v) =>
          Array.isArray(v) &&
          v.length === 2 &&
          v[0] >= -90 &&
          v[0] <= 90 &&
          v[1] >= -180 &&
          v[1] <= 180,
        message: "Coordinates must be valid latitude and longitude",
      },
    },
    
  },
}, { timestamps: true });

module.exports = mongoose.model("Address", addressSchema);
