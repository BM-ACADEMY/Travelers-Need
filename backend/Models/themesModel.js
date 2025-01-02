const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["HONEYMOON", "HILL STATIONS", "WILDLIFE", "PILGRIMAGE", "HERITAGE", "BEACH"],
    uppercase: true,
  },
  description: { type: String, trim: true },
  images: {
    type: [String], // Array of image URLs or file paths
    default: [],
    validate: {
      validator: (v) => v.every((url) => /^[^<>:;,?"*|]+$/.test(url)),
      message: "One or more image paths are invalid",
    },
  },
}, { timestamps: true });

module.exports = mongoose.model("Theme", themeSchema);
