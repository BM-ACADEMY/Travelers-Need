const Booking = require("../Models/bookingModel");

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

    const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updatedData, { new: true });

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking updated successfully", booking: updatedBooking });
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
