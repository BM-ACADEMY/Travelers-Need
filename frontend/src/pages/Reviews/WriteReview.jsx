import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useUser } from "../../hooks/UserContext";
import {jwtDecode} from "jwt-decode";


const WriteReview = () => {
  const [formData, setFormData] = useState({
    tourRating: "",
    recommend: "",
    name: "",
    email: "",
    bookingId: "",
    userId: "675967cbf1c99091fbc0dd89", // Default userId = 1
    comments: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const secretKey = "userData"; // Token key in sessionStorage

  // Extract userId from token on component load
  useEffect(() => {
    const token = sessionStorage.getItem(secretKey);
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.userId) {
          setFormData((prevData) => ({
            ...prevData,
            userId: decoded.userId, // Set userId from token
          }));
        }
        // Check if the token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.log("Token has expired.");
          sessionStorage.removeItem(secretKey);
        }
      } catch (error) {
        console.error("Error decoding token:", error.message);
      }
    }
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseurl = import.meta.env.VITE_BASE_URL; // Replace with your base URL
      await axios.post(`${baseurl}/reviews/create-review`, formData);

      setMessage("Review submitted successfully!");
      setError("");
      setFormData({
        tourRating: "",
        recommend: "",
        name: "",
        email: "",
        bookingId: "",
        userId: "675967cbf1c99091fbc0dd89", // Reset to default userId
        comments: "",
      });
    } catch (error) {
      setError("Error submitting review. Please try again.");
      setMessage("");
      console.error("Error submitting review:", error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Write a Review
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
        }}
      >
        <Grid container spacing={2}>
          {/* Tour Rating */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="tourRating-label">Tour Rating</InputLabel>
              <Select
                labelId="tourRating-label"
                id="tourRating"
                name="tourRating"
                value={formData.tourRating}
                onChange={handleChange}
                label="Tour Rating"
              >
                {[1, 2, 3, 4, 5].map((rating) => (
                  <MenuItem key={rating} value={rating}>
                    {rating}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Recommend */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel id="recommend-label">Recommend</InputLabel>
              <Select
                labelId="recommend-label"
                id="recommend"
                name="recommend"
                value={formData.recommend}
                onChange={handleChange}
                label="Recommend"
              >
                <MenuItem value="true">Yes</MenuItem>
                <MenuItem value="false">No</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Name */}
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Email */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Order ID */}
          <Grid item xs={12}>
            <TextField
              label="Order ID"
              name="bookingId"
              value={formData.bookingId}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Comments */}
          <Grid item xs={12}>
            <TextField
              label="Comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              required
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ py: 1.5, backgroundColor: "rgba(40, 41, 65, 1)", color: "white" }}
            >
              Submit Review
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* Success/Error Message */}
      {message && (
        <Alert severity="success" sx={{ mt: 3, textAlign: "center" }}>
          {message}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 3, textAlign: "center" }}>
          {error}
        </Alert>
      )}
    </Container>
  );
};

export default WriteReview;
