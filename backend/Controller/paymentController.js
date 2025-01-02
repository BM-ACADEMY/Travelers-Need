const Payment = require("../Models/paymentModel");

// 1. Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, userId, price, upiTransactionId, paymentMethod,status } = req.body;

    // Create a new payment
    const newPayment = new Payment({
      bookingId,
      userId,
      price,
      upiTransactionId,
      status,
      paymentMethod,
      
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment created successfully", payment: newPayment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("bookingId", "orderId price")
      .populate("userId", "name email");
    res.json({ message: "All payments retrieved", payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId)
      .populate("bookingId", "orderId price")
      .populate("userId", "name email");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment retrieved successfully", payment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update payment status by ID
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId,
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment status updated successfully", payment: updatedPayment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete a payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
