import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "../Statecard/StateCard.css"; // Import custom CSS for animations

const StateCard = ({ stateName, stateImage, startingPrice, cityCount }) => {
  return (
   <Link   to={`/tour-packages/${encodeURIComponent(stateName)}`}
   className="text-decoration-none">
    <div className="shadow-sm border-0  card state-card ">
      {/* Image */}
      <img
        src={stateImage}
        alt={stateName}
        className="card-img-top"
        style={{ height: "230px", objectFit: "cover" }}
      />
      {/* Card Body */}
      <div className=" text-start p-2 ">
        <h4 className="fw-bold " style={{color:"#ef156c",fontSize:"15px "}}>{stateName}</h4>
        <p className="text-muted mb-0">{cityCount}+ destinations</p>
      </div>
    </div>
   </Link> 
  );
};

export default StateCard;
