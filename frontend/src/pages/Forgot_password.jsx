import React, { useState } from "react";
import { TextField, Button, FormHelperText } from "@mui/material";
import axios from "axios";

const Forgot_password = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/users/forgot-password`, {
        email,
      });
      setSuccessMessage(response.data.message);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to send reset link. Please try again.");
    }
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="row shadow-lg rounded bg-white p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <TextField
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            {error && <FormHelperText error>{error}</FormHelperText>}
            {successMessage && (
              <p className="text-success mt-2">{successMessage}</p>
            )}
          </div>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="btn mt-3"
            style={{backgroundColor:'rgba(40, 41, 65, 1)',color:'white'}}
          >
            Send Reset Link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Forgot_password;
