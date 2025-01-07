import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Booking from "./pages/Booking";
import Places from "./pages/Places";
import Travelers from "./pages/Travelers";
import TourPackages from "./pages/TourPackages";
import Feedback from "./pages/Feedback";
import Support from "./pages/Support";
import Settings from "./pages/Settings";
import "./AdminModule.css";

function AdminModule() {
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Sidebar initially closed
  const [activeLink, setActiveLink] = useState("/");

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen); // Toggle sidebar state
  };
  const handleActiveLink = (link) => {
    setActiveLink(link);
  };

  return (
    <Router>
      <div className="admin-layout">
        {/* Header */}
        <Header toggleSidebar={toggleSidebar} />

        {/* Sidebar (Offcanvas) */}
        <Sidebar
          isOpen={isSidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeLink={activeLink}
        />

        {/* Main Content */}
        <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/places" element={<Places />} />
            <Route path="/travelers" element={<Travelers />} />
            <Route path="/tour-packages" element={<TourPackages />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AdminModule;
