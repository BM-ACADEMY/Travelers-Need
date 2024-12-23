import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Destinations/Top_destinations.css";
import { useNavigate } from "react-router-dom";
const Top_destinations = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch data from the API
  useEffect(() => {
    const fetchTopDestinations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/packages/get-top-destinations-by-state"
        );
        setData(response.data.data); // Set the grouped data
        console.log(response.data.data, "top");

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopDestinations();
  }, []);

  const handleCardClick = (packageId) => {
    navigate(`/package-details-page/${packageId}`);
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2
        className="text-center mb-4"
        style={{
          backgroundColor: "rgba(40, 41, 65, 1)", // Violet color with opacity
          color: "white", // White text
          padding: "10px 20px", // Padding for spacing
          borderRadius: "8px", // Rounded edges for aesthetics
          fontSize: "20px",
        }}
      >
        Top Destinations
      </h2>

      {/* Loop through states */}
      {Object.keys(data).map((stateName) => {
        const stateData = data[stateName];
        return (
          <div key={stateName} className="mb-5">
            {/* State Name */}
            <h3 className="text-center text-uppercase mb-4">{stateName}</h3>

            {/* Cities under the state */}
            <div className="row">
              {Object.keys(stateData.cities).map((cityName) => {
                const cityPackages = stateData.cities[cityName];

                return cityPackages.map((pkg) => {
                  const packageImageURLs = pkg.images.map((imagePath) => {
                    const normalizedPath = imagePath.replace(/\\/g, "/");
                    const pathParts = normalizedPath.split("/");
                    const packageIndex = pathParts.findIndex(
                      (part) => part === "packages"
                    );
                    const packageName =
                      packageIndex !== -1 ? pathParts[packageIndex + 1] : "";
                    const fileName = pathParts.pop();

                    return `http://localhost:3000/api/packages/get-package-image?packageName=${encodeURIComponent(
                      packageName
                    )}&fileName=${encodeURIComponent(fileName)}`;
                  });

                  const lastImageURL =
                    packageImageURLs[packageImageURLs.length - 1];

                  return (
                    <div
                      key={pkg.packageId}
                      className="col-lg-4 col-md-6 col-sm-12 mb-4"
                      onClick={() => handleCardClick(pkg.packageId)} // Pass packageId to the function
                      style={{ cursor: "pointer" }}
                    >
                      <div className="destination-card position-relative">
                        {/* Package Image */}
                        <img
                          src={lastImageURL}
                          alt={cityName}
                          className="img-fluid rounded"
                          style={{
                            width: "100%",
                            height: "300px",
                            objectFit: "cover",
                          }}
                        />

                        {/* Default Package Name */}
                        <div className="package-name position-absolute bottom-0 start-0 p-2 bg-dark text-white w-100 text-center">
                          {cityName}
                        </div>

                        {/* Hover Overlay */}
                        <div
                          className="destination-overlay position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
                          style={{
                            backgroundColor: "rgba(0, 0, 0, 0.6)",
                            opacity: 0,
                            transition: "opacity 0.3s ease",
                            top: 0,
                            left: 0,
                          }}
                        >
                          <h4 className="text-white text-center">
                            View Details
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Top_destinations;
