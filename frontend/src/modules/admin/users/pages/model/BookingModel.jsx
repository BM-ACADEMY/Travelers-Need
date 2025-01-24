import React, { useState, useEffect } from "react";
import { Modal, Tab, Tabs } from "react-bootstrap";
import { useUser } from "../../../../../hooks/UserContext";
import axios from "axios";
import AlertMessage from "../../../reusableComponents/AlertMessage";
import {createBooking} from "../../../services/ApiService";
const BookingModal = ({ baseFare, packageId }) => {
  console.log(baseFare);

  const { user, logout } = useUser();
  console.log(user);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");
  const [formData, setFormData] = useState({
    adults: 1,
    children: 0,
    date: "",
    price: baseFare,
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
  });
  const [formErrors, setFormErrors] = useState({});
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Dynamically update the price based on adults and children
  useEffect(() => {
    const adults = parseInt(formData.adults) || 0;
    const children = parseInt(formData.children) || 0;

    // Assuming children are charged 50% of the base fare
    const totalPrice = adults * baseFare + children * (baseFare * 0.5);

    setFormData((prev) => ({
      ...prev,
      price: totalPrice,
    }));
  }, [formData.adults, formData.children, baseFare]);

  const handleConfirmBooking = async () => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      // Prepare data for the POST request
      const bookingData = {
        userId: user.userId, // userId passed from parent
        packageId: packageId, // packageId passed from parent
        adults: formData.adults,
        children: formData.children,
        date: formData.date,
        price: formData.price,
        travelerName: formData.travelerName,
        email: formData.email,
        phone: formData.phone,
        alternatePhone: formData.alternatePhone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        country: formData.country,
        state: formData.state,
        city: formData.city,
        pincode: formData.pincode,
      };
      console.log(bookingData);
      setLoading(true);
      // Send POST request to the backend
      const response = await createBooking(bookingData);
      if (response && response.status === 201) {
        setLoading(false);
        setStatus("success");
        setMessage("Booking Created successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to save Booking!");
        setShowAlert(true); // Show error alert
      }
    
      console.log("Booking confirmed:", response.data);
      handleClose();
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error confirming booking:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "5px",
          padding:"8px",
          backgroundColor: "#ef156c",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }
  return (
    <div>
      <button className="btn btn-success" onClick={handleShow}>
        Book
      </button>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Tabs
            id="booking-tabs"
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="mb-3"
          >
            <Tab eventKey="tab1" title="Traveler Details">
              <form>
                <div className="mb-3">
                  <label htmlFor="adults" className="form-label">
                    Number of Adults
                  </label>
                  <input
                    type="number"
                    id="adults"
                    className="form-control"
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                  />
                  {formErrors.adults && (
                    <small className="text-danger">{formErrors.adults}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="children" className="form-label">
                    Number of Children
                  </label>
                  <input
                    type="number"
                    id="children"
                    className="form-control"
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="date" className="form-label">
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    className="form-control"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {formErrors.date && (
                    <small className="text-danger">{formErrors.date}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">
                    Total Price (calculated dynamically)
                  </label>
                  <input
                    type="text"
                    id="price"
                    className="form-control"
                    name="price"
                    value={formData?.price?.toFixed(2)}
                    readOnly
                  />
                </div>
              </form>
            </Tab>

            <Tab eventKey="tab2" title="Contact Information">
              <form>
                <div className="mb-3">
                  <label htmlFor="travelerName" className="form-label">
                    Traveler Name
                  </label>
                  <input
                    type="text"
                    id="travelerName"
                    className="form-control"
                    name="travelerName"
                    value={formData.travelerName}
                    onChange={handleChange}
                  />
                  {formErrors.travelerName && (
                    <small className="text-danger">
                      {formErrors.travelerName}
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {formErrors.email && (
                    <small className="text-danger">{formErrors.email}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {formErrors.phone && (
                    <small className="text-danger">{formErrors.phone}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="alternatePhone" className="form-label">
                    Alternate Phone
                  </label>
                  <input
                    type="text"
                    id="alternatePhone"
                    className="form-control"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                  />
                </div>
              </form>
            </Tab>

            <Tab eventKey="tab3" title="Address Details">
              <form>
                <div className="mb-3">
                  <label htmlFor="addressLine1" className="form-label">
                    Address Line 1
                  </label>
                  <input
                    type="text"
                    id="addressLine1"
                    className="form-control"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleChange}
                  />
                  {formErrors.addressLine1 && (
                    <small className="text-danger">
                      {formErrors.addressLine1}
                    </small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="addressLine2" className="form-label">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    id="addressLine2"
                    className="form-control"
                    name="addressLine2"
                    value={formData.addressLine2}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    className="form-control"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  />
                  {formErrors.country && (
                    <small className="text-danger">{formErrors.country}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    className="form-control"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  {formErrors.state && (
                    <small className="text-danger">{formErrors.state}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  {formErrors.city && (
                    <small className="text-danger">{formErrors.city}</small>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="pincode" className="form-label">
                    Pincode
                  </label>
                  <input
                    type="number"
                    id="pincode"
                    className="form-control"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                  {formErrors.pincode && (
                    <small className="text-danger">{formErrors.pincode}</small>
                  )}
                </div>
              </form>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handleConfirmBooking}>
            Confirm Booking
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookingModal;
