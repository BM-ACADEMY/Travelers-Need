import React, { useEffect, useState } from "react";
import { useComponentName } from "../../hooks/ComponentnameContext";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import AlertMessage from "../admin/reusableComponents/AlertMessage";
import {createQuote} from "../admin/services/ApiService";
const CustomerSupport = () => {
  const { setComponentName } = useComponentName();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  useEffect(() => {
    setComponentName("Customer Support");
  }, [setComponentName]);

  const [newQuote, setNewQuote] = useState({
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    duration: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    duration: "",
  });

  // Handle input field changes
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setNewQuote({ ...newQuote, [name]: value });
    validateField(name, value);
  };

  // Field validation
  const validateField = (name, value) => {
    let errorMessage = "";
    switch (name) {
      case "email":
        // Simple email validation
        errorMessage = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(
          value
        )
          ? ""
          : "Invalid email format";
        break;
      case "phone":
        // Only numbers allowed
        errorMessage = /^[0-9]+$/.test(value)
          ? ""
          : "Phone number should contain only digits";
        break;
      case "destination":
        // Destination cannot be empty
        errorMessage = value.trim() === "" ? "Destination is required" : "";
        break;
      case "startDate":
        // Ensure a date is selected
        errorMessage = value === "" ? "Start Date is required" : "";
        break;
      case "duration":
        // Duration should be a valid number
        errorMessage = /^[0-9]+$/.test(value)
          ? ""
          : "Duration should be a number";
        break;
      default:
        break;
    }
    setErrors({ ...errors, [name]: errorMessage });
  };

  // Function to call the POST API
  const addQuote = async () => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
  
    if (isFormValid()) {
      try {
        console.log("Submitting:", newQuote);
  
        const response = await createQuote(newQuote);
  
        if (response && response.status === 201) {
          // Reset form after successful submission
          setNewQuote({
            email: "",
            phone: "",
            destination: "",
            startDate: "",
            duration: "",
          });
  
          setSuccessMessage(true);
          setStatus("success");
          setMessage("Requested Quote successfully!");
        } else {
          setStatus("error");
          setMessage("Failed to Request!");
        }
      } catch (error) {
        console.error("Error:", error);
        setStatus("error");
        setMessage("Something went wrong!");
      } finally {
        setShowAlert(true); // Always show alert after attempt
      }
    } else {
      alert("Please fill all the fields correctly.");
    }
  };
  

  // Check if the form is valid (no errors)
  const isFormValid = () => {
    return (
      Object.values(errors).every((error) => error === "") &&
      Object.values(newQuote).every((value) => value !== "")
    );
  };

  return (
    <div className="container mt-5">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Request Quote</h4>
      </div>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={newQuote.email}
            onChange={handleFieldChange}
            placeholder="Enter your email"
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={newQuote.phone}
            onChange={handleFieldChange}
            placeholder="Enter your phone number"
          />
          {errors.phone && <div style={{ color: "red" }}>{errors.phone}</div>}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Destination</Form.Label>
          <Form.Control
            type="text"
            name="destination"
            value={newQuote.destination}
            onChange={handleFieldChange}
            placeholder="Enter your destination"
          />
          {errors.destination && (
            <div style={{ color: "red" }}>{errors.destination}</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="startDate"
            value={newQuote.startDate}
            onChange={handleFieldChange}
          />
          {errors.startDate && (
            <div style={{ color: "red" }}>{errors.startDate}</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            name="duration"
            value={newQuote.duration}
            onChange={handleFieldChange}
            placeholder="Enter the duration"
          />
          {errors.duration && (
            <div style={{ color: "red" }}>{errors.duration}</div>
          )}
        </Form.Group>
        <Button
          style={{
            backgroundColor: "#ef156c",
            textTransform: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onClick={addQuote}
          disabled={!isFormValid()}
        >
          Add Quote
        </Button>
      </Form>
    </div>
  );
};

export default CustomerSupport;
