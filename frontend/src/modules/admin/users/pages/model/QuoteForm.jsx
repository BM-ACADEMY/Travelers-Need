import React, { useState, useEffect } from "react";
import axios from "axios";

const QuoteForm = () => {
  const [durations, setDurations] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    duration: "",
  });
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/tour-plans/get-all-tour-plans-for-search"
        );
        const { durations } = response.data;
        setDurations(
          durations.map(
            (dur) => `${dur} Days / ${dur - 1} Night${dur > 1 ? "s" : ""}`
          )
        );
      } catch (error) {
        console.error("Error fetching durations:", error);
      }
    };

    fetchDurations();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3000/api/quotes/create-quote",
        formData
      );
      setSuccessAlert(true);
      setFormData({
        email: "",
        phone: "",
        destination: "",
        startDate: "",
        duration: "",
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      setErrorAlert(true);
    }
  };

  const handleAlertClose = () => {
    setSuccessAlert(false);
    setErrorAlert(false);
  };

  return (
    <div className="container mt-4">
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Quote Form </h4>
      </div>
      {successAlert && (
        <div className="alert alert-success" role="alert">
          Quote requested successfully!
        </div>
      )}
      {errorAlert && (
        <div className="alert alert-danger" role="alert">
          Failed to request a quote. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="destination" className="form-label">
            Destination(s)
          </label>
          <input
            type="text"
            className="form-control"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">
            Trip Start Date
          </label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="duration" className="form-label">
            Trip Duration
          </label>
          <select
            className="form-select"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select duration
            </option>
            {durations.map((duration, index) => (
              <option key={index} value={duration}>
                {duration}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="btn w-100"
          style={{
            backgroundColor: "#ef156c",
            textTransform: "none",
            color: "white",
            cursor: "pointer",
          }}
        >
          Request Quote
        </button>
      </form>
    </div>
  );
};

export default QuoteForm;
