import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PackageCard from "../PackageCard/PackageCard"; // Reusable PackageCard component
import "../ThemeCard/ThemePage.css"; // Custom CSS for styling

const ThemePage = () => {
  const { themename } = useParams(); // Get themename from URL params
  const [themeDetails, setThemeDetails] = useState(null);
  const [states, setStates] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThemeDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/themes/get-state-city-by-themename/${encodeURIComponent(
            themename
          )}`
        );
        const { themeDetails, states } = response.data;
        setThemeDetails(themeDetails);
        setStates(states);
      } catch (err) {
        setError(err.response?.data?.error || "Error fetching theme data");
      }
    };

    fetchThemeDetails();
  }, [themename]);

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  if (!themeDetails) {
    return <div className="text-center">Loading theme details...</div>;
  }

  // Process theme image path for dynamic URL
  const themeImagePath = themeDetails.themeImage || "";
  const parts = themeImagePath.split("\\"); // Handle Windows-style paths
  const themeName = parts[2]; // Extract the theme name from the path
  const fileName = parts.pop(); // Extract the file name
  const themeImageURL = `http://localhost:3000/api/themes/get-image-by-query?themeName=${encodeURIComponent(
    themeName
  )}&fileName=${encodeURIComponent(fileName)}`;

  // Generate a random starting price
  const randomPrice = Math.floor(
    Math.random() * (30000 - 10000 + 1) + 10000
  ).toLocaleString();

  return (
    <div className="theme-page">
      {/* Theme Header */}
      <div
        className="theme-header"
        style={{
          backgroundImage: `url(${themeImageURL})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "400px",
        }}
      >
        <div className="overlay text-center">
          <h1 className="theme-name text-white">{themeDetails.themename}</h1>
          <p className="theme-price text-white">Starting from ₹{randomPrice}</p>
        </div>
      </div>

      {/* Theme Description */}
      <div className="container mt-4 text-center">
        <p className="theme-description">{themeDetails.description}</p>
      </div>

      {/* Packages by States */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          Explore Packages Under "{themeDetails.themename}"
        </h2>
        {Object.keys(states).map((stateName) => (
          <div key={stateName} className="state-packages mb-5">
            <h3 className="text-center">{stateName}</h3>
            <div className="row">
              {Object.keys(states[stateName].cities).map((cityName) =>
                states[stateName].cities[cityName].map((pkg) => (
                  <div key={pkg.packageId} className="col-md-6 col-lg-4 mb-4">
                    <PackageCard pkg={pkg} cityName={cityName} />
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ThemePage;
