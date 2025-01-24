import React, { useEffect, useState, useRef } from "react";
import "./PlaceCard.css";
import { useNavigate } from "react-router-dom";


const PlaceCard = ({ place, index, totalCount, onViewDetails }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef(null);
  const navigate = useNavigate();
  var BASE_URL = import.meta.env.VITE_BASE_URL;

  const constructImageURL = (imagePath) => {
    if (!imagePath) {
      console.warn("Image path is not provided.");
      return "";
    }
  
    // Normalize the path separators for cross-platform compatibility
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");
  
    let placeName = parts[0] || ""; // Extract the folder name as placeName
    let fileName = parts[1] || ""; // Extract the file name
  
    // Construct the URL
    return `${BASE_URL}/places/get-image?placeName=${encodeURIComponent(
      placeName
    )}&fileName=${encodeURIComponent(fileName)}`;
  };
  useEffect(() => {
    if (descriptionRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = 5 * lineHeight; // Calculate height of 5 lines
      setIsOverflowing(descriptionRef.current.scrollHeight > maxHeight);
    }
  }, [place.description]);

  const handleToggleDescription = () => {
    if (descriptionRef.current) {
      const lineHeight = parseFloat(
        getComputedStyle(descriptionRef.current).lineHeight
      );
      const maxHeight = 5 * lineHeight;

      if (descriptionRef.current.scrollHeight > maxHeight) {
        setShowFullDescription((prev) => !prev);
      } else {
        console.log("Content does not exceed 5 lines.");
      }
    }
  };
  const handleClick = () => {
    const formattedName = place.name.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with hyphens
    navigate(`/place/${encodeURIComponent(formattedName)}`);
  };
  return (
    <div className="card place-card shadow-sm mb-4" onClick={handleClick}>
      {/* Place Image */}
      {place.images && place.images.length > 0 && (
        <img
          src={constructImageURL(place.images[0])} // Use the first image and construct its URL
          alt={place.name}
          className="card-img-top"
          style={{ objectFit: "cover", height: "200px" }}
        />
      )}

      {/* Card Body */}
      <div className="card-body">
        {/* Place Name and Must Visit Icon */}
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="card-title" style={{ color: "#ef156c" }}>
            {place.name}
          </h5>
          {place.mustVisit === "Y" && (
            <span
              className="must-visit-icon"
              style={{
                color: "white",
                borderRadius: "50%",
                backgroundColor: "#ef156c",
                padding: "10px",
              }}
            >
              ★
            </span>
          )}
        </div>

        {/* Place Position and Count */}
        <p className="text-muted text-center">
          #{index + 1} of {totalCount} Places to Visit
        </p>

        {/* Place Description */}
        <div
          className={`state-description-container ${
            showFullDescription ? "expanded" : ""
          }`}
          style={{
            maxHeight: showFullDescription ? "none" : "120px",
          }}
        >
          <p
            ref={descriptionRef}
            className={`state-description ${
              showFullDescription ? "expanded" : ""
            }`}
            dangerouslySetInnerHTML={{
              __html: place.description,
            }}
          ></p>
        </div>
        {isOverflowing && (
          <button
            className="read-more-toggle"
            onClick={handleToggleDescription}
          >
            {showFullDescription ? "Read Less" : "Read More"}
          </button>
        )}

        {/* View Details Button */}
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-outline-danger"
            style={{
              color: "#fff",
              backgroundColor: "#ef156c",
              borderColor: "#ef156c",
            }}
            onClick={() => onViewDetails(place)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;
