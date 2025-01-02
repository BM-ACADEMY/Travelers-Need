const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  tourRating: {
    type: Number,
    required: true,
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating cannot exceed 5"],
  },
  recommend: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  bookingId: {
    type: String,
    ref: "Booking", // Reference to Tour Plan model
    required: true,
  },
  comments: {
    type: String,
    // maxlength: [ "Comments cannot exceed 500 characters"],
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
