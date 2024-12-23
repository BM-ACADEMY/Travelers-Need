import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretUp,
  faUserCircle,
  faSignOutAlt,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../images/logo.png";
import { useUser } from "../hooks/UserContext";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import Sign_in from "../pages/Sign_in";
import Sign_up from "../pages/Sign_up";

const Navbar = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  // Handlers for modals
  const handleSignInOpen = () => {
    setSignUpOpen(false);
    setSignInOpen(true);
  };

  const handleSignInClose = () => setSignInOpen(false);

  const handleSignUpOpen = () => {
    setSignInOpen(false);
    setSignUpOpen(true);
  };

  const handleSignUpClose = () => setSignUpOpen(false);

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const toggleProfile = () => setProfile((prevState) => !prevState);

  const { user, logout } = useUser();

  const destinations = [
    { country: "India", state: "Tamil Nadu", city: "Pondicherry" },
    { country: "India", state: "Kerala", city: "Alleppey" },
    { country: "India", state: "Himachal Pradesh", city: "Shimla" },
    { country: "UAE", state: "Dubai", city: "Dubai" },
    { country: "Singapore", state: "Central Singapore", city: "Singapore" },
    { country: "France", state: "Ile-de-France", city: "Paris" },
  ];
  const domesticDestinations = destinations.filter(
    (dest) => dest.country === "India"
  );
  const internationalDestinations = destinations.filter(
    (dest) => dest.country !== "India"
  );

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light border-bottom"
      style={{
        backgroundColor: "white",
        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
      }}
    >
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand" to="/">
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "150px",
              height: "80px",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </Link>

        {/* Toggler Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto d-flex gap-3">
            {/* Destinations */}
            <li className="nav-item">
              <Link
                className="nav-link text-dark hover-underline"
                to="/top-destinations"
              >
                Destinations
              </Link>
            </li>

            {/* Tours Dropdown */}
            <li
              className="nav-item dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <Link
                className="nav-link dropdown-toggle hover-underline text-dark d-flex align-items-center"
                to="#"
                id="toursDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Tours
                <FontAwesomeIcon
                  icon={isDropdownOpen ? faCaretUp : faCaretDown}
                  className="ms-2"
                />
              </Link>

              <ul
                className={`dropdown-menu ${
                  isDropdownOpen ? "show" : ""
                } p-3 border-0 shadow-lg`}
                aria-labelledby="toursDropdown"
                style={{ minWidth: "250px" }}
              >
                <li>
                  <h6 className="dropdown-header" style={{ color: "rgba(40, 41, 65, 1)" }}>
                    Domestic Packages
                  </h6>
                </li>
                {domesticDestinations.map((dest, index) => (
                  <li key={index}>
                    <Link
                      className="dropdown-item"
                      to={`/family-packages/domestic/${dest.state
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {dest.state} - {dest.city}
                    </Link>
                  </li>
                ))}

                <li>
                  <hr className="dropdown-divider" />
                </li>

                <li>
                  <h6 className="dropdown-header" style={{ color: "rgba(40, 41, 65, 1)" }}>
                    International Packages
                  </h6>
                </li>
                {internationalDestinations.map((dest, index) => (
                  <li key={index}>
                    <Link
                      className="dropdown-item"
                      to={`/family-packages/international/${dest.country
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {dest.country} - {dest.city}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Other Links */}
            <li className="nav-item">
              <Link className="nav-link text-dark hover-underline" to="/holiday-packages">
                Gateways
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark hover-underline" to="/holiday-deals">
                Tour Plans
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark hover-underline" to="/luxury-holidays">
                Blogs
              </Link>
            </li>

            {/* User Profile Icon with Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle text-dark d-flex align-items-center bg-transparent border-0"
                onClick={toggleProfile}
                aria-expanded={profile ? "true" : "false"}
              >
                <FontAwesomeIcon icon={faUserCircle} className="fs-3 me-1" />
                {user ? user.name : "Guest"}
                <FontAwesomeIcon
                  icon={profile ? faCaretUp : faCaretDown}
                  className="ms-2"
                />
              </button>

              <ul
                className={`dropdown-menu dropdown-menu-end shadow ${
                  profile ? "show" : ""
                }`}
              >
                {user ? (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item text-danger d-flex align-items-center"
                        onClick={logout}
                      >
                        <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button className="dropdown-item" onClick={handleSignInOpen}>
                        Sign In
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleSignUpOpen}>
                        Sign Up
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Sign In Modal */}
      <Dialog open={signInOpen} onClose={handleSignInClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <span>Sign In</span>
            <IconButton onClick={handleSignInClose}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Sign_in
            open={signInOpen}
            onClose={handleSignInClose}
            onSignUpClick={handleSignUpOpen}
          />
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={signUpOpen} onClose={handleSignUpClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="d-flex justify-content-between align-items-center">
            <span>Sign Up</span>
            <IconButton onClick={handleSignUpClose}>
              <FontAwesomeIcon icon={faTimes} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent>
          <Sign_up
            open={signUpOpen}
            onClose={handleSignUpClose}
            onSignInClick={handleSignInOpen}
          />
        </DialogContent>
      </Dialog>
    </nav>
  );
};

export default Navbar;
