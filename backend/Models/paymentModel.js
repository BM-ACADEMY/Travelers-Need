const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking", // Reference to Booking model
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be a positive number"],
  },
  upiTransactionId: {
    type: String,
    required: true,
    unique: true, // Ensure transaction ID is unique
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Failed"], // Payment statuses
    default: "Pending",
  },
  paymentMethod: {
    type: String,
    enum: ["UPI", "Credit Card", "Debit Card", "Net Banking"],
    default:"UPI"
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
