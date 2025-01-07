import React from "react";
import { NavLink } from "react-router-dom"; // Use NavLink for active state
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar, faUsers, faChartBar, faBriefcase, faComments, faCog } from "@fortawesome/free-solid-svg-icons";
import { Offcanvas } from "react-bootstrap"; // For mobile sidebar
import logo from "../../../images/logo.png"; // Add your logo image path here
import './Sidebar.css';

// Sidebar items data
const sidebarItems = [
  { title: "Dashboard", icon: faHome, link: "/" },
  { title: "Booking", icon: faCalendar, link: "/booking" },
  { title: "Travelers", icon: faUsers, link: "/travelers" },
  { title: "Places", icon: faChartBar, link: "/places" },
  { title: "Tour Packages", icon: faBriefcase, link: "/tour-packages" },
  { title: "Feedback", icon: faComments, link: "/feedback" },
  { title: "Support", icon: faComments, link: "/support" },
  { title: "Settings", icon: faCog, link: "/settings" },
];

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  const handleClose = () => {
    setSidebarOpen(false); // Close sidebar when clicked
  };

  return (
    <>
      {/* Desktop Sidebar (Always visible on larger screens) */}
      <div className="desktop-sidebar">
        {/* Sidebar Logo */}
        <div className="sidebar-logo">
          <img src={logo} alt="Logo" className="img-fluid mb-4" />
        </div>
        <ul className="list-unstyled d-flex flex-column gap-2">
          {/* Dynamically render sidebar items */}
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <NavLink
                to={item.link}
                className="sidebar-link"
                style={({ isActive }) => ({
                  backgroundColor: isActive ? '#ef156c' : '',
                  color: isActive ? '#fff' : '#333',
                })}
                onClick={handleClose}
              >
                <FontAwesomeIcon icon={item.icon} className="me-2" />
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <Offcanvas
        show={isOpen}
        onHide={handleClose}
        placement="start"
        backdrop="false" // Disable overlay (no backdrop)
        scroll={true} // Allows scrolling if content is too long
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Admin Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {/* Sidebar Logo */}
          <div className="sidebar-logo">
            <img src={logo} alt="Logo" className="img-fluid mb-4" />
          </div>
          <ul className="list-unstyled">
            {/* Dynamically render sidebar items */}
            {sidebarItems.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.link}
                  className="sidebar-link"
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#ef156c' : '',
                    color: isActive ? '#fff' : '#333',
                  })}
                  onClick={handleClose}
                >
                  <FontAwesomeIcon icon={item.icon} className="me-2" />
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
