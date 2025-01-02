const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  content: { type: String, required: true },
  author: { type: String, required: true },
  themeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theme", // Reference to Theme schema
    required: true, // Ensure every blog is associated with a theme
  },
  images: { type: [String], default: [] },
  publishedAt: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  metaDescription: { type: String, maxlength: 160 },
  views: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
