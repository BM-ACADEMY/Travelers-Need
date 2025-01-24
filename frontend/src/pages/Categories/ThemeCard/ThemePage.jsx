import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PackageCard from "../PackageCard/PackageCard";
import "../ThemeCard/ThemePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import ReusableModal from "../../model/ReusableModel";
import QuoteForm from "../../model/QuoteForm";
const ThemePage = () => {
  const { themename } = useParams();
  const [themeDetails, setThemeDetails] = useState(null);
  const [tourPlans, setTourPlans] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  var BASE_URL = import.meta.env.VITE_BASE_URL;
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
  useEffect(() => {
    const fetchThemeDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/themes/themes/${encodeURIComponent(
            themename
          )}`
        );
        const { theme, tourPlans } = response.data;
        console.log("API Response: ", response.data); // Log the full response
        setThemeDetails(theme);
        setTourPlans(tourPlans || []); // Ensure tourPlans is an array
      } catch (err) {
        console.error("Error fetching theme details:", err);
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

  // Process theme image
  const themeImagePath = themeDetails.themeImage?.[0] || "";
  const parts = themeImagePath.split("\\");

  // Extract themeName and fileName
  const themeName = parts[0]; // "honeymoon"
  const fileName = parts[1]; // "1735803116241-honeymoon.jpg"

  // Construct the URL
  const themeImageURL =
    themeName && fileName
      ? `${BASE_URL}/themes/get-image?themeName=${encodeURIComponent(
          themeName
        )}&fileName=${encodeURIComponent(fileName)}`
      : "/path/to/default-image.jpg";

  // Generate a random starting price
  const startingPrice = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000; // Random between ₹3000 and ₹5000

  return (
    <div className="theme-page">
      <div
        className="theme-header"
        style={{
          backgroundImage: `url(${themeImageURL})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "400px",
          position: "relative",
        }}
      >
        {/* Right Side Quick Quote Section */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: window.innerWidth < 768 ? "5px" : "20px", // Adjust for screen width
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#fff",
            fontSize: "18px",
          }}
        >
          <span className="text-dark">Need Quick Quote?</span>
          <a href="tel:+917799591230" style={{ color: "#fff" }}>
            <FontAwesomeIcon
              icon={faPhone}
              style={{ fontSize: "20px", color: "#ef156c" }}
            />
          </a>
          <a
            href="https://wa.me/9944940051"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#fff" }}
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              style={{ fontSize: "20px", color: "#ef156c" }}
            />
          </a>
          <span className="text-dark">+91-9944940051</span>
        </div>

        {/* Main Content */}
        <div className="text-center header-overlay">
          <p className="tour-plan-count">
            {tourPlans.length} Tour Plans Available
          </p>
          <h1 className="theme-name">{themeDetails.name}</h1>
          <p className="starting-price">Starting from ₹{startingPrice}</p>
        </div>
      </div>

      {/* Theme Description */}
      <div className="container mt-4">
        <p
          className={`theme-description ${
            showFullDescription ? "expanded" : "collapsed"
          }`}
          dangerouslySetInnerHTML={{
            __html: showFullDescription
              ? themeDetails.description
              : themeDetails.description
                  .split("<br>")
                  .slice(0, 4)
                  .join("<br>"),
          }}
        ></p>
        <button
          className="btn btn-link read-more-toggle"
          onClick={() => setShowFullDescription((prev) => !prev)}
        >
          {showFullDescription ? "Read Less" : "Read More"}
        </button>
      </div>

      {/* Top 5 Packages Table */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          Top 5 Packages for {themeDetails.name}
        </h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Package</th>
                <th>Duration</th>
                <th>Starting Price</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {tourPlans.length > 0 ? (
                tourPlans.slice(0, 5).map((pkg) => (
                  <tr key={pkg._id}>
                    <td>{pkg.title}</td>
                    <td>
                      {pkg.duration} Days / {Math.max(pkg.duration - 1, 1)}{" "}
                      Nights
                    </td>
                    <td>₹{pkg.baseFare}</td>
                    <td>
                      <a
                        href={`/tour-plan/${pkg.tourCode}`}
                        className="btn btn-danger"
                        style={{ backgroundColor: "#ef156c" }}
                      >
                        View Details
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No Top Packages Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Tour Plans */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Available Tour Plans</h2>
        <div className="row d-flex flex-column flex-md-row">
          {tourPlans && tourPlans.length > 0 ? (
            tourPlans.map((tourPlan) => (
              <div key={tourPlan._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <PackageCard tourPlan={tourPlan} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center text-muted">
              No Tour Plans Available
            </div>
          )}
        </div>
      </div>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
    </div>
  );
};

export default ThemePage;
