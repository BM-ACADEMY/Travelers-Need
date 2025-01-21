const Booking = require("../Models/bookingModel");
const User = require("../Models/usersModel"); // Assuming User is your model
const TourPlan = require("../Models/tourPlanModel"); // Assuming Package is your model
const mongoose = require("mongoose");

const moment = require("moment");
// 1. Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      packageId,
      price,
      adultCount,
      childCount,
      date,
      username,
      email,
      phoneNumber,
      status,
      address, // Include the address field
    } = req.body;

    // Create a new booking document
    const newBooking = new Booking({
      userId,
      packageId,
      price,
      adultCount,
      childCount,
      date,
      username,
      email,
      phoneNumber,
      status,
      address,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: {
        bookingId: newBooking._id,
        orderId: newBooking.orderId, // Include orderId in the response
        userId: newBooking.userId,
        packageId: newBooking.packageId,
        price: newBooking.price,
        adultCount: newBooking.adultCount,
        childCount: newBooking.childCount,
        date: newBooking.date,
        username: newBooking.username,
        email: newBooking.email,
        phoneNumber: newBooking.phoneNumber,
        address: newBooking.address,
        status: newBooking.status,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("userId", "name email") // Populate user details
      .populate("packageId", "title price duration"); // Populate package details
    res.json({ message: "All bookings retrieved", bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  const userId = req.params.userId; // Get userId from URL params
  const { page = 1, limit = 10, search = "" } = req.query; // Extract pagination and search params
  
  try {
    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Construct the search filter if provided
    const searchFilter = search
      ? { "userId.name": { $regex: search, $options: "i" } }
      : {};

    // Fetch bookings for a user with pagination and search filter
    const bookings = await Booking.find({ userId, ...searchFilter })
      .populate("userId", "username email") // Populate user details
      .populate({
        path: "packageId", // Populate packageId field
        select: "title image baseFare duration", // Select the necessary fields from tourPlans collection
        match: { _id: { $exists: true } } // Ensure the packageId matches an existing package
      })
      .skip(skip) // Skip records for pagination
      .limit(Number(limit)) // Limit records per page

    // Count the total number of bookings for pagination info
    const totalBookings = await Booking.countDocuments({ userId, ...searchFilter });

    if (!bookings.length) {
      return res.status(404).json({ message: "No bookings found for this user" });
    }

    // Return the paginated results with total count for pagination info
    res.json({
      message: `Bookings for user ${userId} retrieved successfully`,
      bookings,
      totalBookings,
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit), // Calculate total pages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAllBookingsByUserDashboard = async (req, res) => {
  try {
    const { userId } = req.params; // UserId from params
    const { page = 1, limit = 10 } = req.query; // Pagination params with default values

    const filter = userId ? { userId: new mongoose.Types.ObjectId(userId) } : {}; // Filter by userId if provided

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of the day

    // Fetch filtered bookings with pagination and sorting
    const bookings = await Booking.find(filter)
      .populate("userId", "username email") // Populate user details
      .populate("packageId", "title price duration") // Populate package details
      .sort({ createdAt: -1 }) // Sort in descending order of creation
      .skip((page - 1) * limit) // Skip records for pagination
      .limit(parseInt(limit)); // Limit the number of records

    // Calculate counts
    const [newBookingCount, totalBookingCount, bookingCompletedCount, cancelBookingCount] = await Promise.all([
      Booking.countDocuments({ ...filter, createdAt: { $gte: currentDate } }), // Count bookings for the current day
      Booking.countDocuments(filter), // Total bookings
      Booking.countDocuments({ ...filter, status: "Confirmed" }), // Completed bookings
      Booking.countDocuments({ ...filter, status: "Cancelled" }), // Cancelled bookings
    ]);

    // Response structure
    res.json({
      message: "Bookings retrieved successfully",
      summary: {
        newBooking: { title: "New Booking", count: newBookingCount },
        totalBooking: { title: "Total Bookings", count: totalBookingCount },
        bookingCompleted: { title: "Completed Bookings", count: bookingCompletedCount },
        cancelBooking: { title: "Cancelled Bookings", count: cancelBookingCount },
      },
      bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalBookingCount / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Import moment.js for date manipulation
exports.getAllBookingsForUpcomingTrips = async (req, res) => {
  try {
    // Define the date filter object
    let dateFilter = {};

    // Get current date
    const currentDate = moment();

    // Filter for the current month and future dates (from today onward)
    const startOfMonth = currentDate.startOf("month").toDate();
    const endOfMonth = currentDate.endOf("month").toDate();

    // Apply the filter: Current month, and start date should be from today onward
    dateFilter.date = {
      $gte: currentDate.toDate(), // Bookings from today onward
      $gte: startOfMonth, // Ensure within the current month
      $lt: endOfMonth, // Ensure within the current month
    };

    // Fetch bookings that match the filter criteria
    const bookings = await Booking.find(dateFilter)
      .populate("userId", "name email date") // Populate user details
      .populate({
        path: "packageId", // Assuming packageId stores the reference to the TourPlan
        model: TourPlan, // Reference the TourPlan model directly
        select: "title price duration images location", // Fields to retrieve
      });

    // If no bookings are found, return a message
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No upcoming bookings found." });
    }

    // Return the filtered bookings
    res.json({ message: "Filtered trips", bookings });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate("userId", "name email")
      .populate("packageId", "title price duration");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking retrieved successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update a booking by ID
exports.updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updatedData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updatedData,
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(201).json({
      message: "Booking updated successfully",
      booking: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete a booking by ID
exports.deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBookingsForBookingPage = async (req, res) => {
  try {
    const { page = 1, limit = 10, searchTerm = "" } = req.query;
    const today = new Date();

    const currentDate = new Date();
    const lastWeek = new Date(currentDate.setDate(currentDate.getDate() - 7));

    // 1. Total Bookings Count and Percentage Increase
    const totalBookings = await Booking.countDocuments();
    const bookingsLastWeek = await Booking.countDocuments({
      createdAt: { $gte: lastWeek },
    });
    const bookingsPercentageIncrease = bookingsLastWeek
      ? ((totalBookings - bookingsLastWeek) / bookingsLastWeek) * 100
      : 0;

    // 2. Total Participants Count and Percentage Increase
    const totalParticipants = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$adultCount" } } },
    ]);
    const totalParticipantsLastWeek = await Booking.aggregate([
      {
        $match: { createdAt: { $gte: lastWeek } },
      },
      { $group: { _id: null, total: { $sum: "$adultCount" } } },
    ]);
    const participantsPercentageIncrease = totalParticipantsLastWeek[0]?.total
      ? ((totalParticipants[0]?.total - totalParticipantsLastWeek[0]?.total) /
          totalParticipantsLastWeek[0]?.total) *
        100
      : 0;

    // 3. Total Earnings and Percentage Increase
    const totalEarnings = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const totalEarningsLastWeek = await Booking.aggregate([
      {
        $match: { createdAt: { $gte: lastWeek } },
      },
      { $group: { _id: null, total: { $sum: "$price" } } },
    ]);
    const earningsPercentageIncrease = totalEarningsLastWeek[0]?.total
      ? ((totalEarnings[0]?.total - totalEarningsLastWeek[0]?.total) /
          totalEarningsLastWeek[0]?.total) *
        100
      : 0;

    // Format the stats data for the response
    const stats = [
      {
        title: "Total Bookings",
        value: totalBookings.toLocaleString(),
        percentage: `${bookingsPercentageIncrease.toFixed(2)}%`,
        percentageColor:
          bookingsPercentageIncrease > 0 ? "text-success" : "text-danger",
        chartData: [800, 950, 1200, 1100, 1300], // Example data, replace with actual data as needed
      },
      {
        title: "Total Participants",
        value: totalParticipants[0]?.total.toLocaleString(),
        percentage: `${participantsPercentageIncrease.toFixed(2)}%`,
        percentageColor:
          participantsPercentageIncrease > 0 ? "text-success" : "text-danger",
        chartData: [3000, 2900, 2845, 2700, 2650], // Example data, replace with actual data as needed
      },
      {
        title: "Total Earnings",
        value: `$${totalEarnings[0]?.total.toLocaleString()}`,
        percentage: `${earningsPercentageIncrease.toFixed(2)}%`,
        percentageColor:
          earningsPercentageIncrease > 0 ? "text-success" : "text-danger",
        chartData: [12000, 13000, 14000, 14500, 14795], // Example data, replace with actual data as needed
      },
    ];

    // 4. Top 5 Packages Based on Booking Count
    const topPackages = await Booking.aggregate([
      // Group by packageId and count the number of bookings
      {
        $group: {
          _id: "$packageId",
          count: { $sum: 1 },
        },
      },

      // Sort by the count in descending order to get the most booked packages first
      {
        $sort: { count: -1 },
      },

      // Limit to top 5 packages
      {
        $limit: 5,
      },

      // Lookup to get package details from the tourplans collection
      {
        $lookup: {
          from: "tourplans", // Name of the collection with package details
          localField: "_id",
          foreignField: "_id",
          as: "packageDetails",
        },
      },

      // Unwind to flatten the array for package details
      {
        $unwind: "$packageDetails",
      },

      // Calculate the percentage and format the final output
      {
        $project: {
          packageName: "$packageDetails.title", // Extract package title
          totalParticipants: "$count", // Total participants (booking count)
          packageId: "$_id", // Package ID for debugging
          percentage: {
            $multiply: [
              { $divide: ["$count", totalBookings] }, // Divide count by total bookings
              100, // Multiply by 100 to get the percentage
            ],
          },
        },
      },
    ]);

    const currentYear = new Date().getFullYear(); // Get the current year

    // Aggregation to get the booking count per month
    const result = await Booking.aggregate([
      // Step 1: Extract the year and month from the createdAt field
      {
        $project: {
          year: { $year: "$createdAt" }, // Extract the year from the createdAt field
          month: { $month: "$createdAt" }, // Extract the month from the createdAt field
        },
      },
      {
        $match: {
          year: currentYear, // Only consider bookings for the current year
        },
      },
      {
        $group: {
          _id: { month: "$month" }, // Group by month
          bookingCount: { $sum: 1 }, // Count the number of bookings for each month
        },
      },
      {
        $sort: { "_id.month": 1 }, // Sort the results by month in ascending order
      },
      {
        $project: {
          month: "$_id.month", // Get the month
          bookingCount: 1, // Include the booking count
          _id: 0, // Exclude the _id field
        },
      },
    ]);

    // Generate the months and booking counts in the desired format
    const labels = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const data = [...Array(12).keys()].map((i) => {
      const monthData = result.find((b) => b.month === i + 1);
      return monthData ? monthData.bookingCount : 0; // Default to 0 if no data for that month
    });

    const bookingAnalytics = {
      labels,
      data,
    };

    // 5. Search for Bookings Based on username or packagename
    const searchQuery = searchTerm
      ? {
          $or: [
            { "userId.username": { $regex: searchTerm, $options: "i" } },
            { "packageId.title": { $regex: searchTerm, $options: "i" } },
          ],
        }
      : {};

    // Get Paginated Bookings
    const bookings = await Booking.find(searchQuery)
      .populate("userId", "username email")
      .populate("packageId", "title price duration") // Ensure you populate the tour plan details
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 }); // Sort by most recent bookings

    res.status(201).json({
      message: "All bookings retrieved successfully",
      stats: stats,
      topPackages,
      bookingAnalytics,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
