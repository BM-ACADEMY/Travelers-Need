const Review = require("../Models/reviewModel");
const Booking=require("../Models/bookingModel");
const TourPlan=require("../Models/tourPlanModel");
const moment = require("moment");
// 1. Create a new review
exports.createReview = async (req, res) => {
  try {
    const { tourRating, recommend, name, email, userId, bookingId, comments } = req.body;

    const newReview = new Review({
      tourRating,
      recommend,
      name,
      email,
      userId,
      bookingId,
      comments,
    });

    await newReview.save();
    res.status(201).json({ message: "Review created successfully", review: newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 2. Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    // Extract pagination parameters from the request query
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 reviews per page
    const skip = (page - 1) * limit; // Calculate skip value

    // Fetch all reviews
    const reviews = await Review.find()
      .populate("userId", "name email") // Populate user details
      .lean(); // Convert Mongoose documents to plain JavaScript objects

    // Fetch all bookings
    const bookings = await Booking.find({}, { orderId: 1, packageId: 1 }).lean();

    // Fetch all tour plans
    const tourPlans = await TourPlan.find({}, { _id: 1, title: 1 }).lean();

    // Filter and map reviews
    const filteredReviews = reviews.map((review) => {
      const booking = bookings.find((b) => b.orderId === review.bookingId); // Match booking by orderId
      if (!booking) return null; // Skip if no matching booking found

      const tourPlan = tourPlans.find((tp) => tp._id.toString() === booking.packageId.toString()); // Match tour plan by packageId
      if (!tourPlan) return null; // Skip if no matching tour plan found

      return {
        ...review,
        tourPlan: { title: tourPlan.title }, // Include matched tour plan details
      };
    }).filter(Boolean); // Remove null values

    // Pagination logic: slice the filtered reviews
    const paginatedReviews = filteredReviews.slice(skip, skip + limit);

    // Total pages calculation
    const totalPages = Math.ceil(filteredReviews.length / limit);

    // Return the paginated reviews
    res.json({
      message: "All reviews retrieved",
      reviews: paginatedReviews,
      currentPage: page,
      totalPages,
      totalReviews: filteredReviews.length,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllReviewsForAdminPage = async (req, res) => {
  try {
    const { page = 1, limit = 10, filter } = req.query;
    const skip = (page - 1) * limit;

    // Fetch collections
    const reviews = await Review.find().lean();
    const bookings = await Booking.find({}, { orderId: 1, packageId: 1 }).lean();
    const tourPlans = await TourPlan.find({}, { _id: 1, title: 1 }).lean();

    // Match reviews with tour plans
    let filteredReviews = reviews
      .map((review) => {
        const booking = bookings.find((b) => b.orderId === review.bookingId);
        if (!booking) return null;

        const tourPlan = tourPlans.find((tp) => tp._id.toString() === booking.packageId.toString());
        if (!tourPlan) return null;

        return {
          ...review,
          tourPlan: { title: tourPlan.title },
        };
      })
      .filter(Boolean);

    // Filter by date if requested
    if (filter) {
      const today = new Date();
      filteredReviews = filteredReviews.filter((review) => {
        const createdAt = new Date(review.createdAt);
        if (filter === "today") {
          return createdAt.toDateString() === today.toDateString();
        } else if (filter === "lastWeek") {
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          return createdAt >= lastWeek && createdAt <= today;
        } else if (filter === "lastMonth") {
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          return createdAt >= lastMonth && createdAt <= today;
        } else if (filter === "thisYear") {
          return createdAt.getFullYear() === today.getFullYear();
        }
        return true; // "all" or no valid filter
      });
    }

    // Paginate reviews
    const paginatedReviews = filteredReviews.slice(skip, skip + limit);
    const totalPages = Math.ceil(filteredReviews.length / limit);

    // Calculate monthly review counts
    const monthlyReviewCounts = filteredReviews.reduce((acc, review) => {
      const month = moment(review.createdAt).format("MMMM YYYY"); // Format as 'Month Year'
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Prepare months for the bar chart, ensuring all months are included
    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      const month = moment().subtract(i, "months").format("MMMM YYYY");
      allMonths.push(month);
    }

    // Add months with no reviews, setting count to 0
    const barChartData = {
      labels: allMonths,
      datasets: [
        {
          label: "Review Counts Per Month",
          data: allMonths.map((month) => monthlyReviewCounts[month] || 0),
          backgroundColor: "#ff6f61", // Example color
        },
      ],
    };

    // Calculate rating counts
    const ratingCounts = filteredReviews.reduce(
      (acc, review) => {
        if (review.tourRating <= 2) acc.poor++;
        else if (review.tourRating <= 4) acc.good++;
        else acc.excellent++;
        return acc;
      },
      { poor: 0, good: 0, excellent: 0 }
    );

    // Calculate overall rating text
    let overallRatingText = "";
    const { poor, good, excellent } = ratingCounts;
    if (excellent >= good && excellent >= poor) {
      overallRatingText = "Excellent";
    } else if (good >= poor) {
      overallRatingText = "Good";
    } else {
      overallRatingText = "Poor";
    }

    // Average rating
    const averageRating =
      filteredReviews.length > 0
        ? (
            filteredReviews.reduce((sum, review) => sum + review.tourRating, 0) /
            filteredReviews.length
          ).toFixed(1)
        : "0.0";

    res.status(200).json({
      message: "Reviews retrieved successfully",
      reviews: paginatedReviews,
      currentPage: parseInt(page),
      totalPages,
      totalReviews: filteredReviews.length,
      ratingCounts,
      averageRating,
      overallRatingText,
      barChartData, // Send bar chart data for the frontend
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews.", error: error.message });
  }
};

// 3. Get reviews for a specific package
exports.getReviewsByPackageId = async (req, res) => {
  try {
    const { packageId } = req.params;
    const reviews = await Review.find({ packageId })
      .populate("userId", "name email")
      .populate("packageId", "title");

    if (!reviews.length) {
      return res.status(404).json({ message: "No reviews found for this package" });
    }

    res.json({ message: "Reviews retrieved successfully", reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 4. Update a review by ID
exports.updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const updatedData = req.body;

    const updatedReview = await Review.findByIdAndUpdate(reviewId, updatedData, { new: true });

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review updated successfully", review: updatedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// 5. Delete a review by ID
exports.deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
