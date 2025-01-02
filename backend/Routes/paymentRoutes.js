const express = require("express");
const {
  createPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
  deletePayment,
} = require("../Controller/paymentController");

const router = express.Router();

// Route for creating a new payment
router.post("/create-payment", createPayment); // POST /create-payment

// Route for getting all payments
router.get("/get-all-payments", getAllPayments); // GET /get-all-payments

// Route for getting a single payment by ID
router.get("/get-payment/:paymentId", getPaymentById); // GET /get-payment/:paymentId

// Route for updating a payment status
router.put("/update-payment-status/:paymentId", updatePaymentStatus); // PUT /update-payment-status/:paymentId

// Route for deleting a payment by ID
router.delete("/delete-payment/:paymentId", deletePayment); // DELETE /delete-payment/:paymentId

module.exports = router;
