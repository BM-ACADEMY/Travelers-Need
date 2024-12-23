import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import "../ThemeCard/ThemeCard.css"; // Import custom CSS for additional styling

const ThemeCard = ({ themeImage, themename, packageCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/themes/${themename}`); // Navigate to ThemePage with themename as a param
  };

  return (
    <div
      className="card theme-card text-center shadow-sm overflow-hidden"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className="position-relative">
        <img
          src={themeImage}
          className="card-img-top theme-card-image"
          alt={themename}
        />
        <div className="theme-card-overlay d-flex flex-column align-items-center justify-content-center">
          <h5 className="text-white fw-bold">{themename}</h5>
          <p className="text-white d-flex align-items-center gap-2">
            <FontAwesomeIcon icon={faSuitcase} className="text-white" />
            {packageCount} Packages
          </p>
          <button className="btn btn-light btn-sm mt-2">View Packages</button>
        </div>
      </div>
    </div>
  );
};

export default ThemeCard;
