const express = require("express");
const router = express.Router();
const {
  createQuote,
  getAllQuotes,
  getQuoteById,
  deleteQuote,
  updateQuoteStatus,
  getAllQuotesForAdminPage,
  updateQuote
} = require("../Controller/quoteController");

// Route to create a new quote
router.post("/create-quote", createQuote);

// Route to fetch all quotes
router.get("/get-all-quotes", getAllQuotes);

router.get("/get-all-quotes-for-admin-page", getAllQuotesForAdminPage);

// Route to fetch a single quote by ID
router.get("/get-quote/:id", getQuoteById);

router.put("/update-quote/:id", updateQuote);

// Route to update quote status
router.patch("/update-quote-status/:id", updateQuoteStatus);

// Route to delete a quote by ID
router.delete("/delete-quote/:id", deleteQuote);

module.exports = router;
