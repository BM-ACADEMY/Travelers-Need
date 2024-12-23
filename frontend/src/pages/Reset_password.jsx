import React, { useState } from "react";
import { TextField, Button, Box, Grid, FormHelperText, Typography } from "@mui/material";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const Reset_password = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(`${baseUrl}/users/reset-password`, {
        token,
        newPassword: password,
      });
      setSuccessMessage(response.data.message);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to reset password. Please try again.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Grid
        container
        maxWidth="sm"
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Grid item xs={12}>
          <Typography variant="h4" align="center" gutterBottom>
            Reset Password
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="New Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                required
              />
              {error && <FormHelperText error>{error}</FormHelperText>}
              {successMessage && (
                <Typography variant="body2" color="green">
                  {successMessage}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "rgba(40, 41, 65, 1)",
                  color: "white",
                  mt: 2,
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Reset Password
              </Button>
            </Box>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Reset_password;
