const Quote = require("../Models/QuoteModel");

// Create a new quote
exports.createQuote = async (req, res) => {
  try {
    const { email, phone, destination, startDate, duration, status } = req.body;

    // Validate required fields
    if (!email || !phone || !destination || !startDate || !duration) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create and save the quote
    const newQuote = new Quote({
      email,
      phone,
      destination,
      startDate,
      duration,
      status: status || "pending", // Default to 'pending' if not provided
    });

    await newQuote.save();
    res.status(201).json({ message: "Quote created successfully!", quote: newQuote });
  } catch (error) {
    res.status(500).json({ message: "Failed to create quote.", error: error.message });
  }
};

// Fetch all quotes
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await quoteModelte.find();
    res.status(200).json(quotes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quotes.", error: error.message });
  }
};

// Update the status of a quote
exports.updateQuoteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // Find and update the quote's status
    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res.status(200).json({ message: "Quote status updated successfully!", quote: updatedQuote });
  } catch (error) {
    res.status(500).json({ message: "Failed to update quote status.", error: error.message });
  }
};

// Get a single quote by ID
exports.getQuoteById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the quote by ID
      const quote = await Quote.findById(id);
  
      if (!quote) {
        return res.status(404).json({ message: "Quote not found." });
      }
  
      res.status(200).json(quote);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch the quote.", error: error.message });
    }
  };
  
  // Delete a quote by ID
  exports.deleteQuote = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find and delete the quote
      const deletedQuote = await Quote.findByIdAndDelete(id);
  
      if (!deletedQuote) {
        return res.status(404).json({ message: "Quote not found." });
      }
  
      res.status(200).json({ message: "Quote deleted successfully!", quote: deletedQuote });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete the quote.", error: error.message });
    }
  };