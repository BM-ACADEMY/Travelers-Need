import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import "./ViewItinerariesPage.css";
const constructImageURL = (imagePath) => {
  if (!imagePath) {
    console.warn("Image path is not provided.");
    return "";
  }

  const normalizedPath = imagePath.replace(/\\/g, "/");
  const parts = normalizedPath.split("/");

  let placeName = parts[0] || ""; // Extract the folder name as placeName
  let fileName = parts[1] || ""; // Extract the file name

  // Construct the URL
  return `http://localhost:3000/api/places/get-image?placeName=${encodeURIComponent(
    placeName
  )}&fileName=${encodeURIComponent(fileName)}`;
};
const TourPlanDetails = ({ tourPlan }) => {
  const [expandedStates, setExpandedStates] = useState([]);
  const navigate=useNavigate();

  const handleToggle = (index) => {
    const updatedStates = [...expandedStates];
    updatedStates[index] = !updatedStates[index]; // Toggle the state for the specific place
    setExpandedStates(updatedStates);
  };

  const formatDescription = (description) => {
    if (!description) return "";
    return description.replace(/<br><br>/g, "<br /><br/>"); // Replace <br><br> with a single <br />
  };

  const {
    images = [],
    title = "",
    tourCode="",
    baseFare = 0,
    origFare = 0,
    startPlace = {},
    endPlace = {},
    itinerary = [],
  } = tourPlan;

  // Generate the image URLs
  const packageImageURLs = images.map((imagePath) => {
    const parts = imagePath.split("\\");
    const tourCode = parts[0] || "";
    const fileName = parts[1] || "";
    return `http://localhost:3000/api/tour-plans/get-tour-plan-image?tourCode=${encodeURIComponent(
      tourCode
    )}&fileName=${encodeURIComponent(fileName)}`;
  });

  // Calculate the total number of places across all days in the itinerary
  const totalPlacesVisited = itinerary.reduce((total, day) => {
    return total + (day.places ? day.places.length : 0);
  }, 0);
  const handlePlaceDetails=(name)=>{
    const formattedName = name.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with hyphens
  navigate(`/place/${encodeURIComponent(formattedName)}`);
}
  const handleTourPlanDetails=()=>{
    const formattedName = tourCode.toLowerCase(); // Convert to lowercase and replace spaces with hyphens
  navigate(`/tour-plan/${formattedName}`);
}
  // Format the title
  const formattedTitle = `${title.toUpperCase()} (FROM ${
    startPlace.city || "START CITY"
  })`;

  return (
    
    <div style={{ textAlign: "center", padding: "20px" }}>
      {/* Display the first image */}
      {packageImageURLs.length > 0 && (
        <img
          src={packageImageURLs[0]}
          alt="Tour Package"
          style={{
            width: "100%",
            maxHeight: "300px",
            objectFit: "cover",
            borderRadius: "10px",
          }}
        />
      )}

      {/* Display the title */}
      <h1 style={{ margin: "20px 0", fontSize: "24px", color: "#333" }}>
        {formattedTitle}
      </h1>

      {/* Display the details */}
      <div
        style={{
          marginTop: "20px",
          fontSize: "18px",
          color: "#555",
          textAlign: "left",
        }}
      >
        <p>
          <strong>Trip Starts From:</strong> {startPlace.city || "N/A"}
        </p>
        <p>
          <strong>Mode of Travel:</strong> Car (or Cab)
        </p>
        <p>
          <strong>Trip Ends At:</strong> {endPlace.city || "N/A"}
        </p>
        <p>
          <strong>Total Places Visited:</strong> {totalPlacesVisited}
        </p>
        <div className="d-flex gap-1 align-content-center">
          <b>Tours Starts from</b>{" "}
          <p style={{ textDecoration: "line-through", margin: "0 10px" }}>
            ₹ {origFare}
          </p>
          <p style={{ margin: "0 10px" }}>
            <b>₹ {baseFare}</b>
          </p>
          <button
            className="btn"
            style={{
              backgroundColor: "#ef156c",
              color: "white",
              minWidth: "150px",
            }}
            onClick={handleTourPlanDetails}
          >
            View Details
          </button>
        </div>
      </div>
 {/* Display the itinerary */}
 <h2 style={{ marginTop: "20px", color: "#333" }}>Itinerary Summary</h2>
        {itinerary.map((day, index) => (
          <div key={index} style={{ margin: "10px 0" }}>
            <h3 style={{ fontSize: "16px", color: "#ef156c" }}>
              Day {day.day}: {day.title}
            </h3>
          </div>
        ))}
      {/* Display the itinerary */}
      <div style={{ textAlign: "left", marginTop: "20px" }}>
        <h2 style={{ color: "#333" }}>Itinerary Summary</h2>
        {itinerary.map((day, index) => (
          <div key={index} style={{ marginBottom: "30px" }}>
            <h4 style={{ color: "#ef156c" }}>
              DAY {day.day}: {day.title.toUpperCase()}
            </h4>
            <p>
              <strong>
                Travel from {startPlace.city || "Start Place"} to {day.title}
              </strong>
            </p>

            {/* Places List */}
            {day.places.map((place, placeIndex) => (
              <div
                key={place._id}
                style={{
                  display: "flex",
                  margin: "20px 0",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {/* Left Image */}
                {place.images && place.images.length > 0 && (
                  <img
                    src={constructImageURL(place.images[0])}
                    alt={place.name}
                    style={{
                      width: "200px",
                      objectFit: "cover",
                    }}
                  />
                )}

                {/* Right Content */}
                <div style={{ flex: 1, padding: "15px", position: "relative" }}>
                  <h3 style={{ color: "#ef156c" }}>{place.name}</h3>
                  <div
                    style={{
                      fontSize: "16px",
                      lineHeight: "1.5",
                      color: "#555",
                      maxHeight: "7.5em", // Fixed height for both states (approx 5 lines)
                      overflowY: expandedStates[placeIndex]
                        ? "scroll"
                        : "hidden", // Enable scroll only when expanded
                      textOverflow: "ellipsis",
                      scrollbarWidth: "thin", // Firefox
                      scrollbarColor: "#ef156c transparent", // Firefox
                    }}
                    className="custom-scrollbar" // Apply custom scrollbar styling
                    dangerouslySetInnerHTML={{
                      __html: formatDescription(place.description),
                    }}
                  ></div>

                 <div className="d-flex gap-3">
                 <button
                    onClick={() => handleToggle(placeIndex)}
                    style={{
                      backgroundColor: "#ef156c",
                      color: "white",
                      border: "none",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "10px",
                    }}
                  >
                    {expandedStates[placeIndex] ? "Read Less" : "Read More"}
                  </button>
                  <button
                    onClick={()=>handlePlaceDetails(place.name)}
                    style={{
                      borderColor: "#ef156c",
                      color: "#ef156c",
                      border: "1px solid",
                      padding: "8px 12px",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "10px",
                      backgroundColor:"white"
                    }}
                  >
                   view Details
                  </button>
                 </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ViewItinerariesPage = () => {
  const { tourCode } = useParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const upperCaseTourCode = tourCode.toUpperCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tour-plans/itinerary/tour-code/${upperCaseTourCode}`
        );

        setPackageDetails(response.data.tourPlan);
        setReviews(response.data.tourPlan.reviews || []);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [upperCaseTourCode]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      {packageDetails ? (
        <TourPlanDetails tourPlan={packageDetails} />
      ) : (
        <p>No tour plan data available.</p>
      )}
    </div>
  );
};

export default ViewItinerariesPage;
