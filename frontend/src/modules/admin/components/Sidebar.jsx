import React from "react";
import { NavLink } from "react-router-dom"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faCalendar, faUsers, faChartBar, faBriefcase, faComments, faCog,faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Offcanvas } from "react-bootstrap"; 
import logo from "../../../images/logo.png"; 
import './Sidebar.css';

const sidebarItems = [
  { title: "Dashboard", icon: faHome, link: "/admin-panel" },
  { title: "Booking", icon: faCalendar, link: "/admin-panel/booking" },
  { title: "Travelers", icon: faUsers, link: "/admin-panel/users" },
  { title: "Places", icon: faChartBar, link: "/admin-panel/places" },
  { title: "Tour Packages", icon: faBriefcase, link: "/admin-panel/tour-packages" },
  { title: "Blog", icon: faBriefcase, link: "/admin-panel/blog" },
  { title: "Address", icon: faLocationDot, link: "/admin-panel/address" },
  { title: "Feedback", icon: faComments, link: "/admin-panel/feedback" },
  { title: "Support", icon: faComments, link: "/admin-panel/support" },
  { title: "Settings", icon: faCog, link: "/admin-panel/settings" },
];

const Sidebar = ({ isOpen, setSidebarOpen }) => {
  const handleClose = () => {
    setSidebarOpen(false); // Close sidebar when clicked
  };

  return (
    <>
      {/* Desktop Sidebar (Always visible on larger screens) */}
      <div className="desktop-sidebar fw-bold">
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
                end={item.link === "/admin-panel"} // Only match exactly for the root route
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
        backdrop="false" 
        scroll={true} 
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
                  end={item.link === "/admin-panel"} // Only match exactly for the root route
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
