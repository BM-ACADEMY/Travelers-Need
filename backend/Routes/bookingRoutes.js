const express = require("express");
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
  getAllBookingsForUpcomingTrips,
  getAllBookingsForBookingPage,
  getBookingsByUser,
  getAllBookingsByUserDashboard
} = require("../Controller/bookingController");

const router = express.Router();

// Route for creating a booking
router.post("/create-booking", createBooking); // POST /create-booking

// Route for getting all bookings
router.get("/get-all-bookings", getAllBookings); // GET /get-all-bookings
router.get("/get-all-booking-by-userId/:userId", getBookingsByUser); // GET /get-all-bookings

router.get("/get-all-booking-by-userId-for-dashboard/:userId", getAllBookingsByUserDashboard); // GET /get-all-bookings

router.get("/get-all-bookings-for-upcoming-trips", getAllBookingsForUpcomingTrips); // GET /get-all-bookings

router.get("/get-all-bookings-for-booking-page", getAllBookingsForBookingPage); // GET /get-all-bookings

// Route for getting a single booking by ID
router.get("/get-booking/:bookingId", getBookingById); // GET /get-booking/:bookingId

// Route for updating a booking by ID
router.put("/update-booking/:bookingId", updateBooking); // PUT /update-booking/:bookingId

// Route for deleting a booking by ID
router.delete("/delete-booking/:bookingId", deleteBooking); // DELETE /delete-booking/:bookingId

module.exports = router;
