import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
import {fetchTourPlanByTourId,createBooking,createPayment} from "../../../modules/admin/services/ApiService";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import ReviewForState from "../../Reviews/ReviewForState";
import ReusableModal from "../../model/ReusableModel";
import QuoteForm from "../../model/QuoteForm";
import BookingPolicy from  "../../staticPages/BookingPolicy"
const PackagePage = () => {
  const { tourCode } = useParams();
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
    price: 0,
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
  const itineraryRef = useRef(null);
  const inclusionsRef = useRef(null);
  const bookingPolicyRef = useRef(null);
  const navigate = useNavigate();
  const upperCaseTourCode = tourCode.toUpperCase();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsModalOpen(true);
    }, 5000); // Show modal after 3 seconds

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (formData) => {
    closeModal();
  };
  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchTourPlanByTourId(upperCaseTourCode);
        setPackageDetails(response.data.tourPlan); // Assuming the response contains `tourPlan` key
        setReviews(response.data.tourPlan.reviews || []); // Assuming reviews are part of the `tourPlan` object
        console.log(response.data.tourPlan.reviews, "rev");
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tourCode]);

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
  useEffect(() => {
    const totalPrice =
      formData.adults * (packageDetails?.baseFare || 0) +
      formData.children * ((packageDetails?.baseFare || 0) * 0.5);
    setFormData((prev) => ({ ...prev, price: totalPrice }));
  }, [formData.adults, formData.children, packageDetails?.baseFare]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update the formData for the specific field
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]:
        name === "adults" || name === "children" ? parseInt(value) || 0 : value, // Ensure adults/children are numbers
    }));
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
      packageId: packageDetails._id,
      price: formData.price, // Function to calculate price
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
      const response = await createBooking(bookingData);
      console.log("Booking successful:", response.data.booking);
      setPackagePrice(response.data.booking.price);
      setOrderId(response.data.booking.orderId);
      setBookingId(response.data.booking.bookingId);
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
        bookingId: bookingId,
        userId: user.userId,
        price: packagePrice,
        upiTransactionId: formData.transactionId,
        status: "Completed",
      };
      console.log(paymentData);

      const response = await createPayment(paymentData);
      alert("Payment Successful! Payment ID: " + response.data.paymentId);
      setPaymentCompleted(true);
    } catch (error) {
      console.error("Error processing payment: ", error);
    }
  };
  const handleViewItinerary = () => {
    navigate(`/view-itineraries/${tourCode}`);
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
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const VITE_GET_IMAGE_FOR_TOUR_PLAN = import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN.startsWith(
    "http"
  )
    ? import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN}`;
  const packageImageURLs = images.map((imagePath) => {
    const parts = imagePath.split("\\"); // Split the image path
    const tourCode = parts[0] || "";
    const fileName = parts[1] || "";

    // Generate and return the image URL for each image
    return `${VITE_GET_IMAGE_FOR_TOUR_PLAN}?tourCode=${encodeURIComponent(
      tourCode?.toLowerCase() || ""
    )}&fileName=${encodeURIComponent(fileName || "")}`;
  });

  // Example usage: packageImageURLs now contains an array of image URLs
  console.log(packageImageURLs);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <div className="container mt-5">
      {/* Package Header */}
      <div>
        <h4>{packageDetails?.title}</h4>
        <p>
          {packageDetails?.addressId?.state}, {packageDetails?.addressId?.city}
        </p>
      </div>
      <div className="card mb-4 shadow-hover">
        <div className="row g-0">
          {/* Swiper Section */}
          <div className="col-md-6">
            {/* Main Image Swiper */}
            <div className="swiper-container position-relative">
              {packageImageURLs.length === 1 ? (
                // Show a single image if only one image is available
                <img
                  src={packageImageURLs[0]}
                  alt="Tour Image"
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                // Use Swiper for multiple images
                <>
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
                        <img
                          src={url}
                          alt={`Slide ${index + 1}`}
                          style={{
                            width: "100%",
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
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
                        <img
                          src={url}
                          alt={`Thumbnail ${index + 1}`}
                          style={{
                            width: "100%",
                            borderRadius: "4px",
                            objectFit: "cover",
                          }}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              )}
            </div>
          </div>

          {/* Package Details Section */}
          <div className="col-md-6 d-flex align-items-center">
            <div className="card-body">
              {/* Rating */}
              <div className="d-flex align-items-center mb-3">
                <span className="me-2">Rating:</span>
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    style={{
                      color:
                        index < (packageDetails?.reviews?.averageRating || 4)
                          ? "#ffc107"
                          : "#e4e5e9",
                      fontSize: "18px",
                    }}
                  >
                    ★
                  </span>
                ))}
                <span className="ms-2 text-muted">
                  ({packageDetails?.reviews?.count || 0} Reviews)
                </span>
              </div>

              {/* Prices */}
              <div className="d-flex align-items-center mb-3">
                <h6
                  className="mb-0 me-3"
                  style={{ textDecoration: "line-through", color: "#6c757d" }}
                >
                  ₹{packageDetails?.origFare}
                </h6>
                <h4 className="mb-0" style={{ color: "#ef156c" }}>
                  ₹{packageDetails?.baseFare}
                </h4>
                <span className="ms-2 text-muted">(Per Adult)</span>
              </div>

              {/* Icons */}
              <div className="d-flex justify-content-start align-items-center gap-4 mb-4">
                <div className="text-center">
                  <i className="fas fa-bed" style={{ fontSize: "20px" }}></i>
                  <p className="mb-0 mt-1" style={{ fontSize: "14px" }}>
                    Stay
                  </p>
                </div>
                <div className="text-center">
                  <i className="fas fa-car" style={{ fontSize: "20px" }}></i>
                  <p className="mb-0 mt-1" style={{ fontSize: "14px" }}>
                    Travel
                  </p>
                </div>
                <div className="text-center">
                  <i
                    className="fas fa-binoculars"
                    style={{ fontSize: "20px" }}
                  ></i>
                  <p className="mb-0 mt-1" style={{ fontSize: "14px" }}>
                    Sightseeing
                  </p>
                </div>
                <div className="text-center">
                  <i
                    className="fas fa-utensils"
                    style={{ fontSize: "20px" }}
                  ></i>
                  <p className="mb-0 mt-1" style={{ fontSize: "14px" }}>
                    Breakfast
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-center gap-3">
                <button
                  className="btn"
                  style={{
                    backgroundColor: "#ef156c",
                    color: "white",
                    minWidth: "150px",
                  }}
                  onClick={scrollToBookingForm}
                >
                  Book Now
                </button>
                <button
                  className="btn btn-outline-secondary"
                  style={{ minWidth: "150px" }}
                  onClick={() => {
                    const phoneNumber = "919944940051"; // Replace with your WhatsApp number
                    const message = encodeURIComponent(
                      "Hello, I would like to customize my travel package."
                    );
                    window.location.href = `https://wa.me/${phoneNumber}?text=${message}`;
                  }}
                >
                  Customize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inclusions */}
      {/* <div className="card mb-4 shadow-hover">
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
      </div> */}
      <div className="container mt-4">
        {/* Navigation Menu */}
        <div className="d-flex justify-content-around align-items-center border-bottom pb-2 mb-4">
          <div
            className="text-center cursor-pointer"
            onClick={() => scrollToSection(itineraryRef)}
          >
            <i className="fas fa-calendar-alt fa-2x"></i>
            <p className="mt-1">Itinerary</p>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => scrollToSection(inclusionsRef)}
          >
            <i className="fas fa-list-alt fa-2x"></i>
            <p className="mt-1">Details</p>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => scrollToSection(bookingPolicyRef)}
          >
            <i className="fas fa-file-alt fa-2x"></i>
            <p className="mt-1">Booking Policy</p>
          </div>
        </div>

        {/* Itinerary Section */}
        <div ref={itineraryRef} className="mb-5">
          <h3 className="mb-3">Itinerary</h3>
          {packageDetails.itinerary.map((day, index) => (
            <div key={index} className="mb-4">
              <h5>
                Day {day.day}: {day.title}
              </h5>
              <p>
                <strong>Start Time:</strong> {day.startTime}
                {index === packageDetails.itinerary.length - 1 && (
                  <>
                    {" "}
                    | <strong>End Time:</strong> {day.endTime}
                  </>
                )}
              </p>
              <ul>
                {day.activities.map((activity, i) => (
                  <li key={i}>{activity}</li>
                ))}
              </ul>
            </div>
          ))}
          <button
            className="btn"
            style={{
              backgroundColor: "#ef156c",
              color: "white",
              minWidth: "150px",
            }}
            onClick={handleViewItinerary}
          >
            View Complete Itinerary
          </button>
        </div>

        {/* Combined Details Section */}
        <div ref={inclusionsRef} className="mb-5">
          <h3 className="mb-3">Details</h3>

          {/* Inclusions */}
          <div className="mb-4">
            <h5>Inclusions</h5>
            <ul>
              {packageDetails.inclusions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Exclusions */}
          <div className="mb-4">
            <h5>Exclusions</h5>
            <ul>
              {packageDetails.exclusions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Optional */}
          <div className="mb-4">
            <h5>Optional</h5>
            <ul>
              {packageDetails.optional.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking Policy Section */}
        <div ref={bookingPolicyRef} className="mb-5">
          <h3 className="mb-3">Booking Policy</h3>
          <BookingPolicy />
          {/* <ul>
            {packageDetails?.bookingPolicy?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul> */}
        </div>
      </div>
      {/* Booking Form */}
      <div>
        {!isBookingConfirmed ? (
          <div ref={bookingFormRef} className="card mb-4 ">
            <h4
              className="card fw-bold"
              style={{
                border: "none",
                color: "rgba(40,41,65,1)",
                padding: "10px",
              }}
            >
              {paymentStep ? "Payment Form" : "Booking Form"}
            </h4>
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
                  <TextField
                    fullWidth
                    label="Total Price"
                    type="number"
                    name="price"
                    value={formData.price} // Display calculated price
                    onChange={handleChange} // Allow manual input
                    className="mb-3"
                  />

                  {/* Display total price */}
                  <h5>Total Price: ₹{formData.price}</h5>
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
                    src="https://via.placeholder.com/150/00FF00?text=Success" // Example animated success GIF
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
      <div className="mt-3">
        <ReviewForState stateName={packageDetails?.addressId?.state} />
      </div>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
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
