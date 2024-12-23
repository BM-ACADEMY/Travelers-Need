const express = require('express');
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require('../Controller/bookingController');

const router = express.Router();

// **POST**: Create a new booking
router.post('/create-booking', createBooking);

// **GET**: Retrieve all bookings
router.get('/get-all-bookings', getAllBookings);

// **GET**: Retrieve a booking by ID
router.get('/get-booking/:id', getBookingById);

// **PUT**: Update a booking by ID
router.put('/update-booking/:id', updateBooking);

// **DELETE**: Delete a booking by ID
router.delete('/delete-booking/:id', deleteBooking);

module.exports = router;
