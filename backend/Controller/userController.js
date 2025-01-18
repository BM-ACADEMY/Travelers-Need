const User = require("../Models/usersModel");
const nodemailer = require("nodemailer");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const transporter = nodemailer.createTransport({
  // service: "Gmail",
  host: "smtp.gmail.com",
  secure: true,
  port: 465,
  auth: {
    user: "charles.bmtechx@gmail.com",
    pass: "shibjhookhqqaazz",
  },
});
// **GET**: Retrieve all users
// **GET**: Retrieve all active users
// **GET**: Retrieve all active users with pagination and search
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, search = "" } = req.query; // Default page to 1, search to an empty string
    const limit = 5; // Records per page
    const skip = (page - 1) * limit; // Calculate records to skip

    // Build query for active users and search
    const query = {
      isActive: 1,
      username: { $regex: search, $options: "i" }, // Case-insensitive search on the `username` field
    };

    // Fetch total user count and paginated results
    const totalUsers = await User.countDocuments(query);
    const users = await User.find(query).skip(skip).limit(limit);

    // Return paginated results
    res.status(200).json({
      total: totalUsers, // Total number of matching records
      page: Number(page), // Current page
      limit, // Records per page
      totalPages: Math.ceil(totalUsers / limit), // Total pages
      users, // Paginated user records
    });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving users: " + error.message });
  }
};

// **GET**: Retrieve a single active user by ID
const getUserById = async (req, res) => {
  const {UserById}=req.params;
  try {
    const user = await User.findOne({ _id: UserById, isActive: 1 }); // Match ID and active status
    if (!user) {
      return res.status(404).json({ error: "User not found or inactive" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving user: " + error.message });
  }
};

// **POST**: Create a new user
const createUser = async (req, res) => {
  try {
    console.log("Request received:", req.body);

    const { username, email, phoneNumber, password, confirmPassword, role } =
      req.body;

    // Validate required fields
    if (!username || !email || !phoneNumber || !password || !confirmPassword) {
      console.log("Validation failed: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      console.log("Validation failed: Passwords do not match");
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Validation failed: Email already exists");
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate token
    const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
      expiresIn: "10000d",
    });
    console.log("Generated token:", token);

    // Create a new user
    const newUser = new User({
      username,
      email,
      phoneNumber,
      password,
      role,
      token,
    });

    // Save the user
    await newUser.save();
    console.log("User saved:", newUser);

    // Respond with success
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
        token: newUser.token,
      },
    });
  } catch (err) {
    console.error("Error in createUser:", err);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// **PUT**: Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { username, email, phoneNumber, password, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { username, email, phoneNumber, password, role },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error updating user: " + error.message });
  }
};

// **DELETE**: Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { deleteUserId } = req.params; // Get the user ID from the params
    const user = await User.findByIdAndUpdate(
      deleteUserId,
      { isActive: 0 }, // Set isActive to 0 for logical delete
      { new: true } // Return the updated user document
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(201).json({ message: "User logically deleted successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Error logically deleting user: " + error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user and include the password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user);
    console.log(password, user.password);

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("Password match:", validPassword);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
        phoneNumber: user.phoneNumber,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    console.log("Generated token:", token);

    // Respond with user data and token
    res.status(200).json({
      message: "Login successful",
      token,
      // user: {
      //   id: user._id,
      //   username: user.username,
      //   email: user.email,
      //   role: user.role,
      // },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.token = resetToken; // Save the token in the database
    await user.save();

    // Generate reset link
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Send email with reset link
    const mailOptions = {
      from: "charles.bmtechx@gmail.com",
      to: email,
      subject: "Password Reset Request",
      html: `
          <h3>Password Reset Request</h3>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>If you did not request this, please ignore this email.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Find user by reset token
    const user = await User.findOne({ token });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    // Update the password
    user.password = newPassword; // Hash the password before saving in a real application
    user.token = null; // Clear the reset token
    await user.save();

    res.status(200).json({ message: "Password has been reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

// module.exports = loginUser;

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};
