import React from "react";
import { Navigate } from "react-router-dom"; // Use Navigate for redirects in v6
import { jwtDecode } from "jwt-decode";

const UserRoute = ({ element, ...rest }) => {
  const token = sessionStorage.getItem("userData"); // Retrieve the JWT token from sessionStorage

  let isAdmin = false;

  if (token) {
    try {
      // Decode the JWT token to extract the user data
      const decodedToken = jwtDecode(token);

      // Check if the decoded token contains the "admin" role
      isAdmin =
        decodedToken && decodedToken.role && decodedToken.role.includes("user");
    } catch (error) {
      console.error("Error decoding JWT token", error);
    }
  }

  // If the user is an admin, render the requested element, otherwise redirect to /sign_in
  return isAdmin ? element : <Navigate to="/" />;
};

export default UserRoute;
