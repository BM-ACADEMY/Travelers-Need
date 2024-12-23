const Booking = require('../Models/bookingModel'); // Import Booking model

// **POST**: Create a new booking
const createBooking = async (req, res) => {
  try {
    const bookingData = req.body;

    // Create and save the booking
    const newBooking = new Booking(bookingData);
    await newBooking.save();

    res.status(201).json({ message: 'Booking created successfully', booking: newBooking });
  } catch (error) {
    res.status(400).json({ error: 'Error creating booking: ' + error.message });
  }
};

// **GET**: Retrieve all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email') // Populate user details (select specific fields)
      .populate('packageId', 'name description'); // Populate package details (select specific fields)
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving bookings: ' + error.message });
  }
};

// **GET**: Retrieve a booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id)
      .populate('userId', 'name email') // Populate user details
      .populate('packageId', 'name description'); // Populate package details

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving booking: ' + error.message });
  }
};

// **PUT**: Update a booking by ID
const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true } // Return the updated document and validate
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking updated successfully', booking: updatedBooking });
  } catch (error) {
    res.status(400).json({ error: 'Error updating booking: ' + error.message });
  }
};

// **DELETE**: Delete a booking by ID
const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({ message: 'Booking deleted successfully', booking: deletedBooking });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting booking: ' + error.message });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};
