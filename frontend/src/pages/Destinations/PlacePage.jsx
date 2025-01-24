import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './PlacePage.css';
import ReusableModal from "../model/ReusableModel";
import QuoteForm from "../model/QuoteForm";


const PlacePage = () => {
  const { placeName } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  const constructImageURL = (imagePath) => {
    if (!imagePath) {
      console.warn("Image path is not provided.");
      return "";
    }
  
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");
    const placeName = parts[0] || "";
    const fileName = parts.slice(1).join("/") || "";
  
    return `${BASE_URL}/places/get-image?placeName=${encodeURIComponent(
      placeName
    )}&fileName=${encodeURIComponent(fileName)}`;
  };
  

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsModalOpen(true);
    }, 5000); // Show modal after 3 seconds

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (formData) => {
    closeModal();
  };

  const formatNameToOriginal = (formattedName) => {
    return formattedName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const originalName = formatNameToOriginal(placeName);
        const response = await fetch(
          `http://localhost:3000/api/places/get-sub-places?name=${encodeURIComponent(
            originalName
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch place details");
        }

        const data = await response.json();
        setPlaceDetails(data?.subPlace);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlaceDetails();
  }, [placeName]);

  if (!placeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="place-page container">
      <div className="row">
        {/* Title */}
        <h3 className="my-4" style={{ color: "black" }}>
          {placeDetails.placeTitle || placeDetails.name}
        </h3>
      </div>
      <div className="row ">
        {/* Image and Details */}
        <div className="col-md-6">
          {placeDetails.images && placeDetails.images.length > 0 && (
            <img
              src={constructImageURL(placeDetails.images[0])}
              alt={placeDetails.name}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "8px",
              }}
            />
          )}
        </div>
        <div className="col-md-6">
          <ul className="list-unstyled">
            <div className="d-flex gap-3">
              <li>
                <strong style={{color:"#ef156c"}}>Country: </strong>
                {placeDetails.state?.country || "N/A"}
              </li>
              <li>
                <strong style={{color:"#ef156c"}}>State: </strong>
                {placeDetails.state?.state || "N/A"}
              </li>
              <li>
                <strong style={{color:"#ef156c"}}>City: </strong>
                {placeDetails.state?.city || "N/A"}
              </li>
            </div>
            <li>
              <strong style={{color:"#ef156c"}}>Ranking: </strong>
              #{placeDetails.rank || 2} of 39 Places to Visit in Pondicherry
            </li>
            <li>
              <strong  style={{color:"#ef156c"}}>Distance: </strong>
              {placeDetails.distance || "N/A"}
            </li>
            <li>
              <strong style={{color:"#ef156c"}}> Trip Duration (Including Travel): </strong>
              {placeDetails.idealTripDuration || "N/A"} Hour
            </li>
            <li>
              <strong style={{color:"#ef156c"}}>Place Location: </strong>
              {placeDetails.placeLocation || "N/A"}
            </li>
            <li>
              <strong style={{color:"#ef156c"}}>Transportation Options: </strong>
              {placeDetails.transportOption || "N/A"}
            </li>
            <li>
              <strong style={{color:"#ef156c"}}>Travel Tips: </strong>
              <div
                dangerouslySetInnerHTML={{
                  __html: placeDetails.travelTips || "No tips available.",
                }}
                style={{ lineHeight: "1.6", marginTop: "10px" }}
              ></div>
            </li>
          </ul>
        </div>
      </div>

      {/* Description */}
      <div className="row mt-4">
        <div className="col">
          <p dangerouslySetInnerHTML={{ __html: placeDetails.description }} />
        </div>
      </div>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
    </div>
  );
};

export default PlacePage;
