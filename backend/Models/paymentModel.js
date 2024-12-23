const mongoose = require('mongoose');

// Define the payment schema
const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking', // Reference to the Booking model
    required: [true, 'Booking ID is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: [true, 'User ID is required'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
  },
  upiTransactionId: {
    type: String,
    required: [true, 'UPI Transaction ID is required'],
    unique: true, // Ensure the transaction ID is unique
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed'], // Payment statuses
    default: 'Pending', // Default status
  },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Payment model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
