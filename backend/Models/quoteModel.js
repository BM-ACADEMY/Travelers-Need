const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  destination: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending", // Default status is 'pending'
  },
});

module.exports = mongoose.model("Quote", quoteSchema);


