import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faBell, faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap"; 
import "./Header.css"; // You can still use custom styles for minor tweaks

const Header = ({ toggleSidebar, activeTitle }) => {
  return (
    <header className="header sticky-top bg-white ">
      <div className="container-fluid d-flex justify-content-between align-items-center p-3">
        {/* Left side: Sidebar Toggle and Active Title */}
        <div className="d-flex align-items-center">
          <button className="btn btn-link p-0" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} className="fs-3" />
          </button>
          <h4 className="m-0 ms-3">{activeTitle}</h4>
        </div>

        {/* Right side: Search, Notifications, User Profile */}
        <div className="d-flex align-items-center">
          {/* Search Input */}
          <div className="d-none d-md-flex align-items-center ms-3">
            <FontAwesomeIcon icon={faSearch} className="fs-5 me-2" />
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="Search..."
            />
          </div>

          {/* Notifications Icon */}
          <FontAwesomeIcon
            icon={faBell}
            className="ms-3 fs-4"
            style={{ cursor: "pointer" }}
          />

          {/* User Profile Dropdown */}
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
                <FontAwesomeIcon icon={faSignOutAlt} className="me-2 " style={{}} />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default Header;
