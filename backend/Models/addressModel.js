const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["domestic", "international"], 
      required: true 
    },
    stateImage: { 
      type: String, // File path or URL of the image
      required: false, // Optional field
      trim: true, // Removes extra whitespace
      validate: {
        validator: function (v) {
          // Validate that the field is a valid file path
          return /^[^<>:;,?"*|]+$/.test(v); // Ensures no invalid file characters are included
        },
        message: 'Invalid file path format',
      },
    },
    startingPrice: {
      type: Number, // Represents the starting price for the location
      required: true, // Mandatory field
      validate: {
        validator: function (v) {
          return v >= 0; // Price must be non-negative
        },
        message: 'Starting price must be a non-negative number',
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
