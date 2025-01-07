const express = require("express");
const router = express.Router();
const {
  createQuote,
  getAllQuotes,
  getQuoteById,
  deleteQuote,
  updateQuoteStatus,
} = require("../Controller/quoteController");

// Route to create a new quote
router.post("/create-quote", createQuote);

// Route to fetch all quotes
router.get("/get-all-quotes", getAllQuotes);

// Route to fetch a single quote by ID
router.get("/get-quote/:id", getQuoteById);

// Route to update quote status
router.put("/update-quote-status/:id", updateQuoteStatus);

// Route to delete a quote by ID
router.delete("/delete-quote/:id", deleteQuote);

module.exports = router;
