const mongoose = require('mongoose');

// Define the review schema
const reviewSchema = new mongoose.Schema(
  {
    tourRating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'], // Assume a 1-5 star rating system
    },
    recommend: {
      type: Boolean,
      default: false, // Whether the user recommends the tour
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'], // Basic email validation
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model 
      required: [true, 'User ID is required'], // Ensures each review is tied to a user
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking', // Reference to the Order model
      required: [true, 'Order ID is required'],
    },
    comments: {
      type: String,
      maxlength: [500, 'Comments cannot exceed 500 characters'], // Optional, limited to 500 characters
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Review model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
