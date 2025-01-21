import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import sign_in from "../images/sign-in.jpg";
import { Link } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Grid,
  FormHelperText,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import axios from "axios";
import { useUser } from "../hooks/UserContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase"; // Import auth from the firebase.js file


const Sign_in = ({ open, onClose, onSignUpClick }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ message: "", type: "", visible: false });

  const { login } = useUser();

  // Validation functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.trim() !== "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    switch (name) {
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(value) ? "" : "Enter a valid email address.",
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value) ? "" : "Password cannot be empty.",
        }));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !validateEmail(formData.email) ||
      !validatePassword(formData.password)
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
      const response = await axios.post(`${baseUrl}/users/login`, formData);

      // Use login function from context to set user globally
      login(response.data.token);

      setAlert({
        message: "Sign-in successful!",
        type: "success",
        visible: true,
      });

      onClose(); // Close the dialog on successful login
    } catch (error) {
      setAlert({
        message: "Invalid credentials. Please try again.",
        type: "danger",
        visible: true,
      });
    }
  };

  const closeAlert = () => setAlert({ ...alert, visible: false });

  const isFormValid =
    validateEmail(formData.email) && validatePassword(formData.password);
 
  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.getCustomParameters({ prompt: "select_account" });
    try {
      const resource = await signInWithPopup(auth, provider);
      console.log(resource, "auth");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>Sign In</span>
          <IconButton onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {/* Alert Box */}
        {alert.visible && (
          <div
            className={`alert alert-${alert.type}`}
            role="alert"
            style={{ marginBottom: "1rem" }}
          >
            {alert.message}
            <button
              type="button"
              className="btn-close ms-2"
              aria-label="Close"
              onClick={closeAlert}
            ></button>
          </div>
        )}

        <Grid container spacing={2} sx={{ padding: 4 }}>
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
              <Button
                variant="contained"
                color="warning"
                fullWidth
                onClick={handleGoogleClick}
                startIcon={<FontAwesomeIcon icon={faGoogle} />}
                sx={{ mb: 2 }}
              >
                Sign In with Google
              </Button>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<FontAwesomeIcon icon={faFacebook} />}
                sx={{ mb: 4 }}
              >
                Sign In with Facebook
              </Button>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <TextField
                    label="Email ID"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  {errors.email && (
                    <FormHelperText error>{errors.email}</FormHelperText>
                  )}
                  <TextField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    required
                  />
                  {errors.password && (
                    <FormHelperText error>{errors.password}</FormHelperText>
                  )}
                  <Link to="/forgot_password" className="text-primary">
                    Forgot Password!
                  </Link>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={!isFormValid}
                    sx={{
                      backgroundColor: "rgba(40, 41, 65, 1)",
                      color: "white",
                      mt: 2,
                      "&:disabled": { backgroundColor: "#ccc" },
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>

          {/* Image Section */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Image */}
            <img
              src={sign_in}
              alt="Sign-In Visual"
              className="img-fluid rounded"
              style={{
                width: "100%",
                height: "50vh",
                objectFit: "cover",
                transition: "transform 0.3s ease-in-out",
              }}
            />

            {/* Overlay */}
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
                Welcome to Sign In
              </h1>
              <p style={{ fontSize: "1rem", color: "white" }}>
                Don't have an account?{" "}
                <span
                  style={{
                    color: "white",
                    textDecoration: "underline",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={onSignUpClick}
                >
                  Sign Up
                </span>
              </p>
            </Box>

            {/* Hover Effect */}
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

export default Sign_in;
