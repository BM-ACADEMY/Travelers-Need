const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getImage,
  getBlogByTitle
} = require("../Controller/blogController");

const router = express.Router();

// Configure multer for file uploads with size limit (set to 5MB for example)
const upload = multer({
  dest: path.join(__dirname, "..", "uploads", "blogs"), // Folder where blog images will be uploaded
  // Limit file size to 5MB
});

// Routes for blog management
router.post("/create-blog", upload.array("images"), createBlog); // Create a new blog
router.get("/get-all-blogs", getAllBlogs); // Get all blogs
router.get("/get-blog-title/:title", getBlogByTitle); // Get all blogs
router.get("/get-blog/:id", getBlogById); // Get a specific blog by ID
router.put("/update-blog/:id", upload.array("images"), updateBlog); // Update a blog by ID
router.delete("/delete-blog/:id", deleteBlog); // Delete a blog by ID
router.get("/get-image", getImage); // Serve a blog image based on folder name and file name

// Error handling middleware for unhandled errors
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = router;
