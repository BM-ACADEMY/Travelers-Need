import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import sign_up_bg from "../images/sign-up-bg.jpg";
import {
  TextField,
  Button,
  Box,
  Grid,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";

const Sign_up = ({ open, onClose, onSignInClick }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  // Validation functions
  const validateFullName = (name) => /^[a-zA-Z\s]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;
  const validateMobileNumber = (number) => /^[0-9]{10}$/.test(number);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case "username":
        setErrors((prev) => ({
          ...prev,
          username: validateFullName(value)
            ? ""
            : "Full Name should contain only alphabets.",
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(value) ? "" : "Enter a valid email address.",
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value)
            ? ""
            : "Password should be at least 6 characters.",
        }));
        break;
      case "phoneNumber":
        setErrors((prev) => ({
          ...prev,
          phoneNumber: validateMobileNumber(value)
            ? ""
            : "Mobile Number must be exactly 10 digits.",
        }));
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            value !== formData.password ? "Passwords do not match" : "",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateFullName(formData.username) ||
      !validateEmail(formData.email) ||
      !validatePassword(formData.password) ||
      !validateMobileNumber(formData.phoneNumber) ||
      formData.password !== formData.confirmPassword
    ) {
      setAlert({
        message: "Please fix the validation errors.",
        type: "danger",
        visible: true,
      });
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/users/register`, formData);

      setAlert({
        message: "Signup successful! You can now sign in.",
        type: "success",
        visible: true,
      });

      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
      });

      onClose(); // Close the modal after signup success
    } catch (error) {
      setAlert({
        message: "Something went wrong! Please try again.",
        type: "danger",
        visible: true,
      });
    }
  };

  const closeAlert = () => setAlert({ ...alert, visible: false });

  const isFormValid =
    validateFullName(formData.username) &&
    validateEmail(formData.email) &&
    validatePassword(formData.password) &&
    validateMobileNumber(formData.phoneNumber) &&
    formData.password === formData.confirmPassword;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Sign Up</span>
          <IconButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ padding: 4, borderRadius: 2, boxShadow: 3 }}>
          <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: 3 }}>
            <Box sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
              <Typography variant="h4" className="text-center mb-4" gutterBottom>
                SIGN UP
              </Typography>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                sx={{ mb: 2 }}
              >
                Sign Up with Google
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faFacebook} />}
                sx={{ mb: 4 }}
              >
                Sign Up with Facebook
              </Button>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="User Name"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.username}
                    helperText={errors.username}
                  />
                  <TextField
                    label="Email ID"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                  />
                  <TextField
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword}
                  />
                  <TextField
                    label="Mobile Number"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.phoneNumber}
                    helperText={errors.phoneNumber}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isFormValid}
                    sx={{
                      backgroundColor: "rgba(40, 41, 65, 1)",
                      color: "white",
                      mt: 2,
                      "&:disabled": {
                        backgroundColor: "#ccc",
                      },
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <Box
              component="img"
              src={sign_up_bg}
              alt="Signup Visual"
              className="img-fluid rounded"
              sx={{
                width: "100%",
                height: "80vh",
                objectFit: "cover",
                borderRadius: 2,
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                },
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
                color: "white",
                zIndex: 2,
              }}
            >
              <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
                Welcome to Sign Up
              </h1>
              <p style={{ fontSize: "1rem",color:'white' }}>
                Already have an account?{" "}
                <span
                  onClick={onSignInClick}
                  style={{
                    color: "white",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Sign In
                </span>
              </p>
            </Box>
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 1,
                opacity: 0,
                transition: "opacity 0.3s ease-in-out",
                "&:hover": {
                  opacity: 1,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default Sign_up;
