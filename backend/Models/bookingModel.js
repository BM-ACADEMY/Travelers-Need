const mongoose = require('mongoose');

// Function to generate a unique order ID
const generateOrderId = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Random 6-digit number
  return `ORDER${randomNumber}`;
};

// Define the booking schema
const bookingSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    default: generateOrderId, // Automatically generate the order ID
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'User ID is required'],
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package', // Reference to the Package model
    required: [true, 'Package ID is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'], // Booking statuses
    default: 'Pending', // Default status
  },
  adultCount: {
    type: Number,
    required: [true, 'Adult count is required'],
    min: [1, 'At least one adult is required'], // Ensure at least one adult
  },
  childCount: {
    type: Number,
    default: 0, // Optional field; defaults to 0
    min: [0, 'Child count cannot be negative'],
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Phone number must be 10 digits'], // Ensure valid phone number format
  },
  alternatePhoneNumber: {
    type: String,
    match: [/^\d{10}$/, 'Alternate phone number must be 10 digits'], // Optional field
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true,
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
