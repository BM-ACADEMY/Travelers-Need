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
router.get('/get-all-users', getAllUsers); 
router.get('/get-user-by-id/:UserById', getUserById); 
router.post('/register', createUser);
router.put('/update-user/:id',  updateUser); 
router.put('/delete-user/:deleteUserId',  deleteUser); 
router.post('/login', loginUser); 
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
