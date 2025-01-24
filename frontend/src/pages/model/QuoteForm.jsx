import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  Button,
  Box,
  Typography,
  Grid,
  Snackbar,
  Alert,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faEnvelope,
  faPhone,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const QuoteForm = ({ onSubmit }) => {
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
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    const fetchDurations = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/tour-plans/get-all-tour-plans-for-search`
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
      // Simulate API call
      await axios.post(
        `${BASE_URL}/quotes/create-quote`,
        formData
      );
      setSuccessAlert(true); // Show success alert
      if (onSubmit) onSubmit(formData);
    } catch (error) {
      console.error("Error submitting the form:", error);
      setErrorAlert(true); // Show error alert
    }
  };

  const handleAlertClose = (reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlert(false);
    setErrorAlert(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h6" align="center" gutterBottom>
        Need help with this tour?
      </Typography>
      <hr />
      <Typography
        variant="body2"
        align="center"
        gutterBottom
        style={{ marginBottom: "4px" }}
      >
        Please provide below details for a customized quote
      </Typography>

      <Box sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {/* Email and Phone */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                variant="outlined"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <FontAwesomeIcon
                icon={faEnvelope}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#888",
                }}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Phone"
                type="tel"
                variant="outlined"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <FontAwesomeIcon
                icon={faPhone}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#888",
                }}
              />
            </Box>
          </Grid>

          {/* Destination */}
          <Grid item xs={12}>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                label="Destination(s)"
                type="text"
                variant="outlined"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <FontAwesomeIcon
                icon={faLocationDot}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#888",
                }}
              />
            </Box>
          </Grid>

          {/* Trip Start Date */}
          <Grid item xs={12} sm={6}>
            <Box sx={{ position: "relative" }}>
              <TextField
                fullWidth
                type="date"
                label="Trip Start Date"
                variant="outlined"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{
                  min: new Date().toISOString().split("T")[0], // Set minimum date to today's date
                }}
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "15px",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#888",
                }}
              />
            </Box>
          </Grid>

          {/* Trip Duration */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Trip Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              variant="outlined"
              required
            >
              {durations.length > 0 ? (
                durations.map((duration, index) => (
                  <MenuItem key={index} value={duration}>
                    {duration}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  Loading durations...
                </MenuItem>
              )}
            </TextField>
          </Grid>
        </Grid>

        {/* Submit Button */}
        <Box mt={3}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              backgroundColor: "#ef156c",
              color: "white",
              "&:hover": {
                backgroundColor: "#d9145c",
              },
            }}
          >
            Request Quote
          </Button>
        </Box>
      </Box>

      {/* Success Alert */}
      <Snackbar
        open={successAlert}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Quote requested successfully!
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      <Snackbar
        open={errorAlert}
        autoHideDuration={3000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Failed to request a quote. Please try again.
        </Alert>
      </Snackbar>
    </form>
  );
};

export default QuoteForm;
