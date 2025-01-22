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


//   const mongoose = require("mongoose");

// const addressSchema = new mongoose.Schema({
//   country: {
//     id: { type: Number, required: true },
//     name: { type: String, required: true },
//     iso2: { type: String, required: true },
//     iso3: { type: String, required: true },
//     phonecode: { type: String, required: true },
//     capital: { type: String, required: true },
//     currency: { type: String, required: true },
//     native: { type: String, required: true },
//     emoji: { type: String, required: true }
//   },
//   state: {
//     id: { type: Number, required: true },
//     name: { type: String, required: true },
//     iso2: { type: String, required: true }
//   },
//   city: {
//     id: { type: Number, required: true },
//     name: { type: String, required: true },
//     latitude: { type: String, required: true },
//     longitude: { type: String, required: true }
//   },
//   description: { type: String, required: true },
//   startingPrice: { type: Number, required: true },
//   coordinates: {
//     type: [Number], // Array of numbers for latitude and longitude
//     required: true,
//     validate: {
//       validator: (v) => Array.isArray(v) && v.length === 2 && !isNaN(v[0]) && !isNaN(v[1]),
//       message: "Coordinates must be an array with latitude and longitude as numbers."
//     }
//   },
//   images: {
//     type: [String], // Array of image URLs or file paths
//     default: [],
//     validate: {
//       validator: (v) => v.every((url) => /^[^<>:;,?"*|]+$/.test(url)),
//       message: "One or more image paths are invalid"
//     }
//   }
// }, { timestamps: true });

// module.exports = mongoose.model("Address", addressSchema);
