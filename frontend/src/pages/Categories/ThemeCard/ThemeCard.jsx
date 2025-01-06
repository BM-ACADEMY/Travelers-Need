import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSuitcase } from "@fortawesome/free-solid-svg-icons";
import "../ThemeCard/ThemeCard.css";

const ThemeCard = ({ icon, name, tourPlanCount }) => {
  const navigate = useNavigate();

  const handleClick = () => {

    navigate(`/themes/${name}`);
  };

  return (
    <div
      className="theme-card text-center shadow-sm"
      onClick={handleClick}
    >
      <div className="p-4">
        <FontAwesomeIcon icon={icon} className="theme-card-icon mb-3" />
        <h5 className="theme-card-title">{name}</h5>
        <p className="theme-card-packages">
          <FontAwesomeIcon icon={faSuitcase} className="me-2" />
          {tourPlanCount} + Destinations
        </p>
      </div>
      <div className="theme-card-overlay">
        <p className="view-details">View Details</p>
      </div>
    </div>
  );
};

export default ThemeCard;
