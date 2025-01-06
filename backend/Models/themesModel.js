const mongoose = require("mongoose");

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ["honeymoon", "hillstations", "wildlife", "pilgrimage", "heritage", "beach"],
      lowercase: true,
    },
    description: { type: String, required: true },
    themeImage: {
      type: [String], // Array of image URLs or file paths
      default: [],
      validate: {
        validator: (v) => v.every((url) => /^[^<>:;,?"*|]+$/.test(url)),
        message: "One or more image paths are invalid",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Theme", themeSchema);
