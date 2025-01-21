const Blog = require("../Models/blogModel");
const fs = require("fs-extra");
const path = require("path");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "blogs");

// Helper function: Create a dynamic folder structure for category or blog state
const createDynamicFolder = async (category) => {
  const categoryFolder = path.join(UPLOADS_ROOT, category.replace(/ /g, "_"));
  await fs.ensureDir(categoryFolder);
  return categoryFolder;
};

// 1. Create a new blog with dynamic image upload
exports.createBlog = async (req, res) => {
  try {
    const { title, author,date, description, cityDetails } = req.body;
    console.log(req.body);
    
    // Create category folder dynamically (can be blog category or something else)
    const categoryFolder = await createDynamicFolder(title);

    // Process image uploads
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const timestamp = Date.now();
        const newFileName = `${file.fieldname}-${timestamp}${path.extname(
          file.originalname
        )}`;
        const destinationPath = path.join(categoryFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
    }

    // Create a new blog document
    const newBlog = new Blog({
      title,
      date,
      author,
      images,
      description,
      cityDetails:cityDetails ? JSON.parse(cityDetails) : [],
    });

    await newBlog.save();
    res
      .status(201)
      .json({ message: "Blog created successfully", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    // Destructure query parameters for pagination and filtering
    const { page = 1, limit = 10, title = '' } = req.query;

    // Build the filter object (if title is provided)
    const filter = title ? { title: { $regex: title, $options: 'i' } } : {};

    // Fetch the blogs with pagination and title filtering
    const blogs = await Blog.find(filter)
      .skip((page - 1) * limit) // Skip the number of items based on the current page
      .limit(parseInt(limit))   // Limit the number of blogs to the provided limit
      .sort({ date: -1 });       // Optional: sort by date (descending)

    // Get the total number of blogs for pagination information
    const totalBlogs = await Blog.countDocuments(filter);

    // Return the blogs with pagination info
    res.json({
      message: "All blogs retrieved successfully",
      blogs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBlogs / limit),
        totalBlogs
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.json({ message: "Blog retrieved successfully", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const formatTitleBack = (formattedTitle) => {
  return formattedTitle
    .replace(/_/g, ' ')  // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase())  // Capitalize first letter of each word
    .trim();  // Trim any leading or trailing spaces if any
};

exports.getBlogByTitle = async (req, res) => {
  try {
    const { title } = req.params;
    const formattedTitle = formatTitleBack(title);

    // Log the formatted title for debugging
    console.log(`Searching for blog with title: "${formattedTitle}"`);

    // Perform a case-insensitive search using a regular expression
    const blog = await Blog.findOne({ title: { $regex: new RegExp(`^${formattedTitle}$`, 'i') } });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.json({ message: "Blog retrieved successfully", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 4. Update a blog by ID
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Ensure that cityDetails is a valid JSON string
    if (updatedData.cityDetails) {
      try {
        updatedData.cityDetails = JSON.parse(updatedData.cityDetails);
      } catch (error) {
        return res.status(400).json({ error: "Invalid JSON format for cityDetails." });
      }
    }

    // Handle file uploads if provided
    if (req.files && req.files.length > 0) {
      const categoryFolder = await createDynamicFolder(updatedData.title || "default");
      const images = [];
      for (const file of req.files) {
        const timestamp = Date.now();
        const newFileName = `${file.fieldname}-${timestamp}${path.extname(file.originalname)}`;
        const destinationPath = path.join(categoryFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
      updatedData.images = images;  // Only update images if new files were uploaded
    }

    // If no new images are uploaded, keep existing images
    if (!updatedData.images && currentBlog && currentBlog.images) {
      updatedData.images = currentBlog.images;  // Retain previous images
    }

    // Update the blog in the database
    const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    res.json({ message: "Blog updated successfully", blog: updatedBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// 5. Delete a blog by ID
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Delete category folder if no other blogs exist for this category
    const categoryFolder = path.join(
      UPLOADS_ROOT,
      blog.title.replace(/ /g, "_")
    );
    const categoryRecords = await Blog.find({ title: blog.title });
    if (categoryRecords.length === 0) {
      await fs.remove(categoryFolder);
    }

    res.json({ message: "Blog deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Serve an image by title and file name
exports.getImage = async (req, res) => {
  try {
    const { title, fileName } = req.query; // Pass title and fileName as query parameters
    const filePath = path.join(
      UPLOADS_ROOT,
      title.replace(/ /g, "_"),
      fileName
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found." });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
