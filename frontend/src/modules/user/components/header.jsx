import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faBell,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import "./Header.css"; // Custom styles for header, including sticky functionality
import { useComponentName } from "../../../hooks/ComponentnameContext";

const Header = ({ toggleSidebar }) => {
  const { componentName } = useComponentName();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`header ${isScrolled ? "scrolled" : ""} sticky-top bg-white`}
    >
      <div className="container-fluid d-flex p-3">
        {/* Left side: Sidebar Toggle and Active Title */}
        <div className="d-flex justify-content-between justify-content-lg-center w-100">
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-link p-0 d-lg-none d-sm-block"
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={faBars} className="fs-3 menu-icon" />
            </button>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <h4 style={{ color: "#ef156c" }}>
              {componentName ? `Welcome to ${componentName}` : "Welcome!"}
            </h4>
          </div>
        </div>
      </div>

      {/* Right side: Search, Notifications, User Profile */}
      {/* <div className="d-flex align-items-center">
          {/* Search Input 
          <div className="d-none d-md-flex align-items-center ms-3">
            <FontAwesomeIcon icon={faSearch} className="fs-5 me-2" />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
            />
          </div>

          {/* Notifications Icon *
          <FontAwesomeIcon
            icon={faBell}
            className="ms-3 fs-4 d-md-none" // Only visible on mobile view (below medium screen size)
            style={{ cursor: "pointer" }}
          />

          {/* User Profile Dropdown *
          <Dropdown className="ms-3">
            <Dropdown.Toggle
              variant="link"
              className="p-0 d-flex align-items-center"
              id="user-dropdown"
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="fs-3"
                style={{ cursor: "pointer" }}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              <Dropdown.Item href="/profile">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                Profile
              </Dropdown.Item>
              <Dropdown.Item href="/logout">
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2 " />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div> */}
      {/* </div> */}
    </header>
  );
};

export default Header;
