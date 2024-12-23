import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useUser } from "../../../hooks/UserContext";
import "../PackageCard/PackagePage.css";
import {
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Sign_in from "../../Sign_in";
import Sign_up from "../../Sign_up";
import qrcode from "../../../assets/qrcode.png.png";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

const PackagePage = () => {
  const { packageId } = useParams();
  const { user, login } = useUser();
  const swiperRef = useRef(null);
  const [packageDetails, setPackageDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
    date: "",
    travelerName: "",
    email: "",
    phone: "",
    alternatePhone: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    paymentMethod: "",
    transactionId: "",
  });
  const bookingFormRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  const [bookingId, setBookingId] = useState(null);
  const [paymentStep, setPaymentStep] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [packagePrice, setPackagePrice] = useState(null);
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const isDateValid = (date) => {
    const today = new Date().toISOString().split("T")[0];
    return date >= today;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packageResponse, reviewsResponse] = await Promise.all([
          axios.get(
            `http://localhost:3000/api/packages/get-package-by-id/${packageId}`
          ),
          axios.get(
            `http://localhost:3000/api/reviews/get-reviews-by-package/${packageId}`
          ),
        ]);

        setPackageDetails(packageResponse.data);
        setReviews(reviewsResponse.data.reviews);
        console.log(reviewsResponse.data.reviews,'rev');
        
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [packageId]);
  const scrollToBookingForm = () => {
    if (!user) {
      setSignInOpen(true);
      return;
    }
    bookingFormRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleSignInClose = () => setSignInOpen(false);
  const handleSignUpClose = () => setSignUpOpen(false);
  const handleSignInSuccess = (token) => {
    login(token);
    setSignInOpen(false);
  };
  const handleSignUpOpen = () => {
    setSignInOpen(false);
    setSignUpOpen(true);
  };
  const handleSignInOpen = () => {
    setSignUpOpen(false);
    setSignInOpen(true);
  };

  const validateStep = () => {
    const errors = {};
    if (activeStep === 0) {
      if (!formData.adults || formData.adults <= 0)
        errors.adults = "Number of adults is required.";
      if (!formData.date) errors.date = "Date is required.";
    } else if (activeStep === 1) {
      if (!formData.travelerName)
        errors.travelerName = "Traveler name is required.";
      if (!formData.email) errors.email = "Email is required.";
      if (!formData.phone) errors.phone = "Phone number is required.";
    } else if (activeStep === 2) {
      if (!formData.addressLine1)
        errors.addressLine1 = "Address Line 1 is required.";
      if (!formData.city) errors.city = "City is required.";
      if (!formData.state) errors.state = "State is required.";
      if (!formData.country) errors.country = "Country is required.";
      if (!formData.pincode) errors.pincode = "Pincode is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const calculateTotal = () => {
    return (
      formData.adults * packageDetails.price +
      formData.children * (packageDetails.price * 0.5)
    );
  };

  const handleConfirmBooking = async () => {
    // Combine address fields into a single string
    const address = [
      formData.addressLine1,
      formData.addressLine2,
      formData.city,
      formData.state,
      formData.country,
      formData.pincode,
    ]
      .filter((part) => part) // Remove empty fields
      .join(", ");

    const bookingData = {
      userId: user.userId, // Assuming user context provides `id`
      packageId,
      price: calculateTotal(), // Function to calculate price
      status: "Confirmed",
      adultCount: formData.adults,
      childCount: formData.children,
      date: new Date(formData.date), // Ensure date is in ISO format
      username: formData.travelerName,
      email: formData.email,
      phoneNumber: formData.phone,
      alternatePhoneNumber: formData.alternatePhone,
      address,
    };
    console.log(bookingData, "booking");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/bookings/create-booking",
        bookingData
      );
      console.log("Booking successful:", response.data.booking);
      setPackagePrice(response.data.booking.price);
      setOrderId(response.data.booking._id);
      setIsBookingConfirmed(true);
      // Handle success: Navigate, show success message, etc.
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      const paymentData = {
        bookingId: orderId,
        userId: user.userId,
        price: packagePrice,
        upiTransactionId: formData.transactionId,
        status: "Completed",
      };
      console.log(paymentData);

      const response = await axios.post(
        "http://localhost:3000/api/payments/create-payment",
        paymentData
      );
      alert("Payment Successful! Payment ID: " + response.data.paymentId);
      setPaymentCompleted(true);
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  };

  const steps = ["Select Location", "Select Date", "Confirm Details"];
  if (loading) {
    return (
      <div>
        <LinearProgress
          style={{ position: "fixed", top: 0, left: 0, width: "100%" }}
        />
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
          <h5 className="mb-3">Loading...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }
  const {
    name,
    price,
    duration,
    inclusions,
    packageDescription,
    bestMonth,
    addressId,
    images,
  } = packageDetails;

  // const packageImagePath = images?.[images.length - 1] || "";
  // const normalizedPath = packageImagePath.replace(/\\/g, "/");
  // const pathParts = normalizedPath.split("/");
  // const packageIndex = pathParts.findIndex((part) => part === "packages");
  // const packageName = packageIndex !== -1 ? pathParts[packageIndex + 1] : "";
  // const fileName = pathParts.pop();

  // const packageImageURL = `http://localhost:3000/api/packages/get-package-image?packageName=${encodeURIComponent(
  //   packageName
  // )}&fileName=${encodeURIComponent(fileName)}`;
  // Assuming 'images' is an array of image paths
  const packageImageURLs = images.map((imagePath) => {
    const normalizedPath = imagePath.replace(/\\/g, "/"); // Normalize path
    const pathParts = normalizedPath.split("/");
    const packageIndex = pathParts.findIndex((part) => part === "packages");
    const packageName = packageIndex !== -1 ? pathParts[packageIndex + 1] : "";
    const fileName = pathParts.pop();

    // Generate the image URL
    return `http://localhost:3000/api/packages/get-package-image?packageName=${encodeURIComponent(
      packageName
    )}&fileName=${encodeURIComponent(fileName)}`;
  });

  // Example usage: packageImageURLs now contains an array of image URLs
  console.log(packageImageURLs);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="container mt-5">
      {/* Package Header */}
      <div className="card mb-4 shadow-hover">
        <div className="row g-0">
          {/* Swiper Section */}
          <div className="col-md-6">
            {/* Main Image Swiper */}
            <div className="swiper-container position-relative">
              <Swiper
                ref={swiperRef}
                style={{
                  "--swiper-navigation-color": "#fff",
                  "--swiper-pagination-color": "#fff",
                }}
                loop={true}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
                className="mySwiper2"
              >
                {packageImageURLs.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img src={url} alt={`Slide ${index + 1}`} />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <button
                className="custom-navigation-button custom-navigation-button-prev"
                onClick={() => swiperRef.current.swiper.slidePrev()}
              >
                &#10094; {/* Left Arrow */}
              </button>
              <button
                className="custom-navigation-button custom-navigation-button-next"
                onClick={() => swiperRef.current.swiper.slideNext()}
              >
                &#10095; {/* Right Arrow */}
              </button>

              {/* Thumbnail Swiper */}
              <Swiper
                onSwiper={setThumbsSwiper}
                loop={true}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress={true}
                modules={[Thumbs]}
                className="mySwiper"
              >
                {packageImageURLs.map((url, index) => (
                  <SwiperSlide key={index}>
                    <img src={url} alt={`Thumbnail ${index + 1}`} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Package Details Section */}
          <div className="col-md-6 d-flex align-items-center">
            <div className="card-body">
              <h2 className="card-title fw-bold hover-text-primary">{name}</h2>
              <p className="text-muted mb-2">{addressId?.state}</p>
              <h5 className=" mb-3" style={{ color: "#ef156c" }}>
                ₹{price} per Adult
              </h5>
              <p className="mb-2">
                <strong>Duration:</strong> {duration}
              </p>
              <p className="mb-2">
                <strong>Best Month to Visit:</strong> {bestMonth}
              </p>
              <button
                className="btn  mt-3"
                style={{ backgroundColor: "#ef156c", color: "white" }}
                onClick={scrollToBookingForm}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Description  */}
      <div className="card mb-4 shadow-hover">
        <div
          className="card-header  text-white fw-bold"
          style={{ backgroundColor: "rgba(40, 41, 65, 1)" }}
        >
          Description
        </div>
        <div className="card-body">
          <div
            className={`description-content ${
              showFullDescription ? "full" : "collapsed"
            }`}
            style={
              showFullDescription
                ? { maxHeight: "none", overflowY: "scroll" }
                : { maxHeight: "4.5rem", overflow: "hidden" }
            }
          >
            <p>{packageDescription}</p>
          </div>
          <button className="btn btn-link p-0" onClick={toggleDescription}>
            {showFullDescription ? "Read Less" : "Read More"}
          </button>
        </div>
      </div>

      {/* Inclusions */}
      <div className="card mb-4 shadow-hover">
        <div
          className="card-header text-white fw-bold"
          style={{ backgroundColor: "rgba(40, 41, 65, 1)" }}
        >
          Inclusions
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {inclusions.map((item, index) => (
              <li key={index} className="list-group-item inclusion-item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Booking Form */}
      <div>
        {!isBookingConfirmed ? (
          <div ref={bookingFormRef} className="card mb-4 shadow-hover">
            <div
              className="card-header  text-white fw-bold"
              style={{ backgroundColor: "rgba(40, 41, 65, 1)" }}
            >
              {paymentStep ? "Payment Form" : "Booking Form"}
            </div>
            <div className="card-body">
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {activeStep === 0 && (
                <div>
                  <TextField
                    fullWidth
                    label="Number of Adults"
                    type="number"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    error={!!formErrors.adults}
                    helperText={formErrors.adults}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Number of Children"
                    type="number"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Date"
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={!!formErrors.date}
                    helperText={formErrors.date}
                    className="mb-3"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0], // Set minimum date to today
                    }}
                  />

                  <h5>Total Price: ₹{calculateTotal()}</h5>
                </div>
              )}

              {activeStep === 1 && (
                <div>
                  <TextField
                    fullWidth
                    label="Traveler Name"
                    name="travelerName"
                    value={formData.travelerName}
                    onChange={handleChange}
                    error={!!formErrors.travelerName}
                    helperText={formErrors.travelerName}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!formErrors.email}
                    helperText={formErrors.email}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={!!formErrors.phone}
                    helperText={formErrors.phone}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Alternate Phone"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="mb-3"
                  />
                </div>
              )}

              {activeStep === 2 && (
                <div>
                  <TextField
                    fullWidth
                    label="Address Line 1"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    error={!!formErrors.addressLine1}
                    helperText={formErrors.addressLine1}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Address Line 2"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    error={!!formErrors.country}
                    helperText={formErrors.country}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    disabled={!formData.country} // Optional: Disable state field if country is empty
                    error={!!formErrors.state}
                    helperText={formErrors.state}
                    className="mb-3"
                  />
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={!formData.state} // Optional: Disable city field if state is empty
                    error={!!formErrors.city}
                    helperText={formErrors.city}
                    className="mb-3"
                  />

                  <TextField
                    fullWidth
                    label="Pincode"
                    name="pincode"
                    type="number"
                    value={formData.pincode}
                    onChange={handleChange}
                    error={!!formErrors.pincode}
                    helperText={formErrors.pincode}
                    className="mb-3"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleConfirmBooking}
                  >
                    Confirm Booking
                  </Button>
                </div>
              )}

              <div className="d-flex justify-content-between mt-4">
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant="contained"
                >
                  Back
                </Button>
                {activeStep < steps.length - 1 && (
                  <Button
                    onClick={handleNext}
                    variant="contained"
                    color="primary"
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="mb-4">Payment Process</h3>
            <h5>
              Booking ID: <strong>{orderId}</strong>
            </h5>
            <h5>
              Total Price: ₹<strong>{packagePrice}</strong>
            </h5>

            {!paymentCompleted ? (
              <div className="upi-payment-section text-center mb-4">
                <h5>Scan the QR Code to Pay</h5>
                <div className="qr-code-container mt-3">
                  <img
                    src={qrcode} // Replace this with your actual QR code image URL
                    alt="QR Code"
                    style={{
                      width: 200,
                      height: 200,
                      border: "2px solid #ccc",
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div className="transaction-id-section mt-4">
                  <TextField
                    fullWidth
                    label="Enter Transaction ID"
                    name="transactionId"
                    value={formData.transactionId}
                    onChange={handleChange}
                    error={!formData.transactionId}
                    helperText={
                      !formData.transactionId
                        ? "Transaction ID is required."
                        : ""
                    }
                    className="mb-3"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handlePaymentSubmit}
                    disabled={!formData.transactionId}
                  >
                    Submit Payment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="payment-success-card text-center">
                <div className="success-animation">
                  <img
                    src="https://via.placeholder.com/150/00FF00?text=Success" // Replace with an animated success GIF if needed
                    alt="Payment Success"
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: "50%",
                      marginBottom: "20px",
                    }}
                  />
                </div>
                <h3 className="text-success">Payment Successful!</h3>
                <p>
                  Your booking has been confirmed. Booking ID:{" "}
                  <strong>{orderId}</strong>
                </p>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => window.location.reload()} // Refresh or redirect after success
                >
                  Back to Home
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="card shadow-hover">
        <div
          className="card-header text-white fw-bold"
          style={{ backgroundColor: "rgba(40, 41, 65, 1)" }}
        >
          Reviews
        </div>
        <div className="card-body">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="mb-3 p-3 border rounded shadow review-card hover-shadow"
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Reviewer Details */}
                <div className="d-flex align-items-center">
                  <div
                    className="rounded-circle d-flex justify-content-center align-items-center"
                    style={{
                      width: "50px",
                      height: "50px",
                      backgroundColor: "#f50057",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "20px",
                      marginRight: "10px",
                    }}
                  >
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h6 className="m-0">{review.name}</h6>
                    <small className="text-muted">{review.username}</small>
                  </div>
                  <div className="ms-auto text-muted">
                    {new Date(review.updatedAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Star Rating */}
                <div className="my-2">
                  {Array.from({ length: 5 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        color: index < review.rating ? "#ffc107" : "#e4e5e9",
                        fontSize: "18px",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Review Comments */}
                <p className="fw-bold">{review.comments}</p>

                {/* Additional Details */}
                {/* <p className="mb-1">
                  <strong>Package:</strong> {review.packageName}
                </p>
                <p className="mb-1">
                  <strong>Duration:</strong> {review.duration}
                </p>
                <p className="mb-1">
                  <strong>Price:</strong> ₹{review.price}
                </p> */}

                {/* Hover Effect */}
                <div
                  className="hover-overlay"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                ></div>
              </div>
            ))
          ) : (
            <p className="text-muted">No reviews yet</p>
          )}
        </div>
      </div>

      <Dialog
        open={signInOpen}
        onClose={handleSignInClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <span>Sign In</span>
            <IconButton onClick={handleSignInClose}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Sign_in
            onClose={handleSignInClose}
            open={signInOpen}
            onSignUpClick={handleSignUpOpen}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={signUpOpen}
        onClose={handleSignUpClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <span>Sign Up</span>
            <IconButton onClick={handleSignUpClose}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Sign_up
            open={signUpOpen}
            onClose={handleSignUpClose}
            onSignInClick={handleSignInOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackagePage;
