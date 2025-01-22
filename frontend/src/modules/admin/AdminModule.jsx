// // AdminModule.jsx
// import React, { useState, useEffect } from "react";
// import { Routes, Route, Outlet, Navigate } from "react-router-dom";
// import Sidebar from "./components/Sidebar";
// import Header from "./components/Header";
// import Dashboard from "../admin/users/pages/Dashboard";
// import Booking from "../admin/users/pages/Booking";
// import Places from "../admin/users/pages/Places";
// import TourPackages from "../admin/users/pages/TourPackages";
// import Feedback from "../admin/users/pages/Feedback";
// import Support from "../admin/users/pages/Support";
// import Settings from "../admin/users/pages/Settings";
// import Travelers from "./users/pages/Travelers";
// import "./AdminModule.css";
// import { jwtDecode } from "jwt-decode";

// function AdminModule() {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const [isAdmin, setIsAdmin] = useState(false);


//   useEffect(() => {
//     try {
//       const token = sessionStorage.getItem("userData"); // JWT token
  
//       if (token) {
//         const decodedToken = jwtDecode(token);
//         console.log(decodedToken?.role,'admin');
        
//         if (decodedToken && decodedToken.role && decodedToken.role.includes("admin")) {
//           console.log('log');
          
//           setIsAdmin(true);
//         } else {
//           setIsAdmin(false);
//         }
//       } else {
//         setIsAdmin(false); // No token in sessionStorage
//       }
//     } catch (error) {
//       console.error("Error decoding token", error);
//       setIsAdmin(false); // Default to false in case of an error
//     }
//   }, []);
  

//   const toggleSidebar = () => {
//     setSidebarOpen(!isSidebarOpen);
//   };

//   if (!isAdmin) {
//     return <Navigate to="/" />; // Redirect to sign in if not an admin
//   }

//   return (
//     <div className="admin-layout">
//       {/* Header */}
//       <Header toggleSidebar={toggleSidebar} />

//       {/* Sidebar (Offcanvas) */}
//       <Sidebar isOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />

//       {/* Main Content */}
//       <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
//         {/* Define nested routes for /admin-panel */}
//         <Routes>
//           <Route path="/" element={<Dashboard />} />
//           <Route path="booking" element={<Booking />} />
//           <Route path="places" element={<Places />} />
//           <Route path="users" element={<Travelers />} />
//           <Route path="tour-packages" element={<TourPackages />} />
//           <Route path="feedback" element={<Feedback />} />
//           <Route path="support" element={<Support />} />
//           <Route path="settings" element={<Settings />} />
//         </Routes>

//         {/* This is where the child components will render */}
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default AdminModule;

import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "../admin/users/pages/Dashboard";
import Booking from "../admin/users/pages/Booking";
import Places from "../admin/users/pages/Places";
import TourPackages from "../admin/users/pages/TourPackages";
import Feedback from "../admin/users/pages/Feedback";
import Support from "../admin/users/pages/Support";
import Settings from "../admin/users/pages/Settings";
import Travelers from "./users/pages/Travelers";
import Address from "../admin/users/pages/Address";
import "./AdminModule.css";
import {jwtDecode} from "jwt-decode";
import Blog from "./users/pages/Blog";

function AdminModule() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state to prevent premature redirect

  useEffect(() => {
    const token = sessionStorage.getItem("userData"); // JWT token

    try {
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);

        // Check if the decoded token contains the admin role
        if (decodedToken?.role?.includes("admin")) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false); // No token in sessionStorage
      }
    } catch (error) {
      console.error("Error decoding token", error);
      setIsAdmin(false);
    } finally {
      setLoading(false); // Mark loading as complete
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  // Show loading spinner or placeholder until the admin check is complete
  if (loading) {
    return <div>Loading...</div>;
  }

  // Redirect to home page if the user is not an admin
  if (!isAdmin) {
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
          <Route path="places" element={<Places />} />
          <Route path="users" element={<Travelers />} />
          <Route path="tour-packages" element={<TourPackages />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="support" element={<Support />} />
          <Route path="settings" element={<Settings />} />
          <Route path="blog" element={<Blog />} />
          <Route path="address" element={<Address />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminModule;

