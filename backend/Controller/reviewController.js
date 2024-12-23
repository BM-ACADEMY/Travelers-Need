const Review = require('../Models/reviewModel');
const Package=require('../Models/reviewModel');
const Booking=require('../Models/bookingModel');
const mongoose = require('mongoose');
// **POST**: Create a new review
const createReview = async (req, res) => {
  try {
    const { tourRating, recommend, name, email, orderId, userId, comments } = req.body;

    // Check for required fields
    if (!tourRating || !name || !email || !orderId || !userId) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    // Create a new review
    const newReview = await Review.create({
      tourRating,
      recommend,
      name,
      email,
      orderId,
      userId,
      comments,
    });

    res.status(201).json({
      message: 'Review created successfully',
      review: newReview,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error creating review',
      details: error.message,
    });
  }
};

// **GET**: Retrieve all reviews
const getAllReviews = async (req, res) => {
  try {
    // Extract page and limit from query parameters
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 records per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const reviews = await Review.aggregate([
      // Match Booking collection based on orderId in Review
      {
        $lookup: {
          from: "bookings", // Booking collection
          localField: "orderId", // orderId in Review
          foreignField: "_id", // _id in Booking
          as: "bookingDetails",
        },
      },
      {
        $unwind: {
          path: "$bookingDetails", // Unwind the bookingDetails array
          preserveNullAndEmptyArrays: false, // Exclude reviews without matching bookings
        },
      },
      // Match Package collection based on packageId in Booking
      {
        $lookup: {
          from: "packages", // Package collection
          localField: "bookingDetails.packageId", // packageId in Booking
          foreignField: "_id", // _id in Package
          as: "packageDetails",
        },
      },
      {
        $unwind: {
          path: "$packageDetails", // Unwind the packageDetails array
          preserveNullAndEmptyArrays: false, // Exclude bookings without matching packages
        },
      },
      // Project the required fields only
      {
        $project: {
          _id: 1, // Review ID
          tourRating: 1,
          recommend: 1,
          name: 1,
          email: 1,
          comments: 1,
          createdAt: 1, // Include review creation date for sorting or display
          bookingDetails: {
            _id: 1, // Booking ID
            price: 1,
            status: 1,
            adultCount: 1,
            childCount: 1,
            date: 1,
            username: 1,
            email: 1,
            phoneNumber: 1,
          },
          packageDetails: {
            _id: 1, // Package ID
            name: 1,
            price: 1,
            duration: 1,
            packageDescription: 1,
          },
        },
      },
      { $skip: skip }, // Skip documents for pagination
      { $limit: limit }, // Limit to the specified number of documents
    ]);

    // Fetch total count for pagination metadata
    const totalRecords = await Review.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "orderId",
          foreignField: "_id",
          as: "bookingDetails",
        },
      },
      {
        $unwind: "$bookingDetails",
      },
      {
        $lookup: {
          from: "packages",
          localField: "bookingDetails.packageId",
          foreignField: "_id",
          as: "packageDetails",
        },
      },
      {
        $unwind: "$packageDetails",
      },
      {
        $count: "totalRecords",
      },
    ]);

    const totalRecordsCount = totalRecords.length > 0 ? totalRecords[0].totalRecords : 0;
    const totalPages = Math.ceil(totalRecordsCount / limit);

    // Send paginated response
    res.status(200).json({
      page,
      limit,
      totalPages,
      totalRecords: totalRecordsCount,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving reviews",
      details: error.message,
    });
  }
};

// **GET**: Retrieve a single review by ID
const getReviewsByPackage = async (req, res) => {
  try {
    const { packageId } = req.params;
console.log(packageId);

    // Validate packageId format
    if (!mongoose.Types.ObjectId.isValid(packageId)) {
      return res.status(400).json({ error: "Invalid packageId format" });
    }

    const packageObjectId = new mongoose.Types.ObjectId(packageId);

    // Log packageObjectId for debugging
    console.log("Package ObjectId:", packageObjectId);

    // Step 1: Find bookings associated with the packageId
    const bookings = await Booking.find({ packageId: packageObjectId }).select("_id");
    console.log("Found Bookings:", bookings);

    if (!bookings || bookings.length === 0) {
      return res.send("No bookings found for this package");
    }

    // Step 2: Extract booking IDs for further filtering
    const bookingIds = bookings.map((booking) => booking._id);

    // Step 3: Find reviews where orderId matches the booking IDs
    const reviews = await Review.find({ orderId: { $in: bookingIds } });
    console.log("Found Reviews:", reviews);

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ error: "No reviews found for this package" });
    }

    res.status(200).json({
      message: `Reviews for package ID: ${packageId}`,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      error: "Error retrieving reviews",
      details: error.message,
    });
  }
};

// **PUT**: Update a review by ID
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate fields for update
    if (req.body.tourRating && (req.body.tourRating < 1 || req.body.tourRating > 5)) {
      return res.status(400).json({
        error: 'Rating must be between 1 and 5',
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true } // Return updated document and validate fields
    );

    if (!updatedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    res.status(400).json({
      error: 'Error updating review',
      details: error.message,
    });
  }
};

// **DELETE**: Delete a review by ID
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.status(200).json({
      message: 'Review deleted successfully',
      data: deletedReview,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error deleting review',
      details: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByPackage,
  updateReview,
  deleteReview,
};
