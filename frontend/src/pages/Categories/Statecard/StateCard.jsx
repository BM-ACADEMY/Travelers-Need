import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "../Statecard/StateCard.css"; // Import custom CSS for animations

const StateCard = ({ stateName, stateImage, startingPrice, cityCount }) => {
  return (
    <Link
      to={`/state/${encodeURIComponent(stateName)}`}
      className="text-decoration-none"
    >
      <div className="card state-card shadow-sm position-relative overflow-hidden">
        <img
          src={stateImage}
          className="card-img-top state-card-image"
          alt={stateName}
        />
        <div className="card-body text-center p-3">
          <h5 className="fw-bold text-dark">{stateName}</h5>
          <p className="text-muted mb-1">Destinations {cityCount}+</p>
          <p className="text-danger fw-bold mb-0">
            Starting from ₹{startingPrice}
          </p>
        </div>
        {/* Hover Overlay */}
        <div className="state-card-overlay d-flex flex-column align-items-center justify-content-center text-white text-center">
          <h6 className="fw-bold mb-2">{stateName}</h6>
          <p className="mb-2">Explore {cityCount}+ Packages</p>
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderColor: "#ef156c", // Outline color
              color: "#ef156c", // Text color
              fontWeight: "bold",
              textTransform: "none", // Disable uppercase
              transition: "background-color 0.3s, color 0.3s", // Smooth transition
              "&:hover": {
                backgroundColor: "#ef156c", // Fill background on hover
                color: "white", // Change text color to white
                borderColor: "#ef156c", // Keep the same border color
              },
            }}
          >
            View More
          </Button>
        </div>
      </div>
    </Link>
  );
};

export default StateCard;
