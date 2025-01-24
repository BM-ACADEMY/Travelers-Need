const quoteModel = require('../Models/quoteModel');

const moment = require("moment");

// Create a new quote
exports.createQuote = async (req, res) => {
  try {
    const { email, phone, destination, startDate, duration, status } = req.body;

    // Validate required fields
    if (!email || !phone || !destination || !startDate || !duration) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create and save the quote
    const newQuote = new quoteModel({
      email,
      phone,
      destination,
      startDate,
      duration,
      status: status || "pending", // Default to 'pending' if not provided
    });

    await newQuote.save();
    res
      .status(201)
      .json({ message: "Quote created successfully!", quote: newQuote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create quote.", error: error.message });
  }
};

// Fetch all quotes
exports.getAllQuotes = async (req, res) => {
  try {
    const quotes = await quoteModel.find();
    res.status(200).json(quotes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch quotes.", error: error.message });
  }
};

exports.getAllQuotesForAdminPage = async (req, res) => {
  try {
    const { page = 1, limit = 5, searchTerm = "", filter = "" } = req.query;
    const skip = (page - 1) * limit;
    const query = {};

    // Apply search term filter if provided
    if (searchTerm) {
      query.$or = [
        { email: { $regex: searchTerm, $options: "i" } },
        { destination: { $regex: searchTerm, $options: "i" } },
      ];
    }

    // Apply date filter only if the filter parameter is specified
    if (filter) {
      const todayStart = moment().startOf("day").toDate(); // 00:00:00 today
      const todayEnd = moment().endOf("day").toDate(); // 23:59:59 today

      if (filter === "today") {
        // Query startDate and compare to today's range
        query.startDate = {
          $gte: todayStart, // Start of the day
          $lte: todayEnd, // End of the day
        };
      } else if (filter === "lastWeek") {
        const lastWeek = moment().subtract(1, "week").startOf("week").toDate();
        query.startDate = { $gte: lastWeek, $lt: todayStart };
      } else if (filter === "lastMonth") {
        const lastMonth = moment().subtract(1, "month").startOf("month").toDate();
        query.startDate = { $gte: lastMonth, $lt: todayStart };
      } else if (filter === "thisYear") {
        const startOfYear = moment().startOf("year").toDate();
        query.startDate = { $gte: startOfYear, $lt: todayStart };
      }
    }

    // Fetch records with pagination
    const quotes = await quoteModel.find(query).skip(skip).limit(parseInt(limit));
    const totalQuotes = await quoteModel.countDocuments(query);
    const totalPages = Math.ceil(totalQuotes / limit);

    res.status(201).json({
      quotes,
      currentPage: parseInt(page),
      totalPages,
      totalQuotes,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch quotes.", error: error.message });
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
    const updatedQuote = await quoteModel.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res
      .status(201)
      .json({
        message: "Quote status updated successfully!",
        quote: updatedQuote,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Failed to update quote status.",
        error: error.message,
      });
  }
};

exports.updateQuote = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, phone, destination, startDate, duration } = req.body;

    // Validate the required fields (optional)
    if (!email || !phone || !destination || !startDate || !duration) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Update the quote (excluding status)
    const updatedQuote = await quoteModel.findByIdAndUpdate(
      id,
      { email, phone, destination, startDate, duration },
      { new: true } // Return the updated document
    );

    if (!updatedQuote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res.status(201).json({
      message: "Quote updated successfully!",
      quote: updatedQuote,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update quote.", error: error.message });
  }
};

// Get a single quote by ID
exports.getQuoteById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the quote by ID
    const quote = await quoteModel.findById(id);

    if (!quote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res.status(200).json(quote);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch the quote.", error: error.message });
  }
};

// Delete a quote by ID
exports.deleteQuote = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the quote
    const deletedQuote = await quoteModel.findByIdAndDelete(id);

    if (!deletedQuote) {
      return res.status(404).json({ message: "Quote not found." });
    }

    res
      .status(201)
      .json({ message: "Quote deleted successfully!", quote: deletedQuote });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete the quote.", error: error.message });
  }
};
