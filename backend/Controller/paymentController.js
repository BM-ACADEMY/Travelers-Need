const Payment = require('../Models/paymentModel'); // Import the Payment model

// Controller to handle creating a new payment
const createPayment = async (req, res) => {
  try {
    const { bookingId, userId, price, upiTransactionId } = req.body;

    // Validate request data
    if (!bookingId || !userId || !price || !upiTransactionId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new payment
    const payment = new Payment({
      bookingId,
      userId,
      price,
      upiTransactionId,
    });

    // Save the payment to the database
    const savedPayment = await payment.save();

    res.status(201).json({
      message: 'Payment created successfully',
      payment: savedPayment,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate UPI Transaction ID error
      return res.status(400).json({
        message: 'UPI Transaction ID must be unique',
      });
    }
    res.status(500).json({
      message: 'An error occurred while creating the payment',
      error: error.message,
    });
  }
};

// Controller to handle fetching all payments
const getAllPayments = async (req, res) => {
  try {
    // Fetch all payments, including referenced data
    const payments = await Payment.find()
      .populate('bookingId') // Populate Booking reference
      .populate('userId'); // Populate User reference

    res.status(200).json({
      message: 'Payments retrieved successfully',
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred while retrieving payments',
      error: error.message,
    });
  }
};

module.exports = {
  createPayment,
  getAllPayments,
};
