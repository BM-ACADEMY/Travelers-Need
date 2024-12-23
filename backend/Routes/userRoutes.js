const express = require('express');
const {
  getAllUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword
} = require('../Controller/userController'); 
const authenticateToken = require('../Middleware/jsonwebtokenMiddleware'); // Import authentication middleware

const router = express.Router();

// Routes for user operations
router.get('/', authenticateToken, getAllUsers); // Get all users
router.get('/:id', authenticateToken, getUserById); // Get a user by ID
router.post('/register', createUser); // Create a new user (public, no auth required for registration)
router.put('/:id', authenticateToken, updateUser); // Update a user by ID
router.delete('/:id', authenticateToken, deleteUser); // Delete a user by ID
router.post('/login', loginUser); // Login route does not require authentication
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
