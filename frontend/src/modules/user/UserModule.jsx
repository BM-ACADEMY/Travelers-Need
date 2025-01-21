import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Booking from "./Booking";
import CustomerSupport from "./CustomerSupport";
import Settings from "./Settings";
import Header from "../user/components/header";
import Sidebar from "../user/components/Sidebar";
import { jwtDecode } from "jwt-decode";
import './UserModule.css';
const UserModule = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const [isUser, setIsUser] = useState(null); // Use null instead of false

  useEffect(() => {
    const token = sessionStorage.getItem("userData"); // JWT token

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Check if the decoded token contains the 'user' role
        if (decodedToken?.role && Array.isArray(decodedToken.role) && decodedToken.role.includes("user")) {
          setIsUser(true); // User role is present
        } else {
          setIsUser(false); // Not a user
        }
      } catch (error) {
        console.error("Error decoding token", error);
        setIsUser(false); // In case of decoding error, consider not being a user
      } finally {
        setLoading(false); // Mark loading as complete after the logic
      }
    } else {
      setIsUser(false); // No token in sessionStorage
      setLoading(false); // Mark loading as complete if no token
    }
  }, []);

  // Show loading spinner or placeholder until the check is complete
  if (loading) {
    return <div>Loading...</div>;
  }
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  // Redirect if not a user
  if (isUser === false) {
    console.log('Navigating to home');
    return <Navigate to="/" />;
  }

  return (
    <div className="admin-layout">
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="booking" element={<Booking />} />
          <Route path="support" element={<CustomerSupport />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserModule;
