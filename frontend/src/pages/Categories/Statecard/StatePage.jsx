import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "../Statecard/StatePage.css";
import PackageCard from "../PackageCard/PackageCard";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarAlt,
  faSearch,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import ReviewForState from "../../Reviews/ReviewForState";
import ReusableModal from "../../model/ReusableModel";
import QuoteForm from "../../model/QuoteForm";
const StatePage = () => {
  const { stateName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [stateData, setStateData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [topPackages, setTopPackages] = useState([]);
  const [startPlaces, setStartPlaces] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [durations, setDurations] = useState([]);
  const [startPlace, setStartPlace] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const hasFetchedStateData = useRef(false); // Tracks state data fetch
  const hasFetchedInitialData = useRef(false); // Tracks initial data fetch
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    const fetchStateData = async () => {
      if (hasFetchedStateData.current) return; // Prevent multiple fetches
      hasFetchedStateData.current = true;

      try {
        const queryParams = new URLSearchParams(location.search);

        const fromValue = queryParams.get("from");
        const durationValue = queryParams.get("duration");

        console.log(durationValue, "duration");
        setDuration(
          `${durationValue} Days / ${durationValue - 1} Night${
            durationValue > 2 ? "s" : ""
          }`
        );
        setStartPlace(fromValue);

        const response = await axios.get(
          `http://localhost:3000/api/tour-plans/tour-plans/state/${encodeURIComponent(
            stateName
          )}?from=${fromValue}&duration=${durationValue}`
        );

        const { address, tourPlans } = response.data;

        setStateData(address || {});
        setPackages(tourPlans || []);

        // Filter top 5 packages with itTop === "Y"
        const topPackagesData = (tourPlans || [])
          .filter((pkg) => pkg.itTop === "Y")
          .slice(0, 5);
        setTopPackages(topPackagesData);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching state data");
      }
    };

    fetchStateData();
  }, [stateName, location.search]);

  // Fetch initial data for dropdowns
  useEffect(() => {
    const fetchInitialData = async () => {
      if (hasFetchedInitialData.current) return; // Prevent multiple fetches
      hasFetchedInitialData.current = true;

      try {
        const response = await axios.get(
          `http://localhost:3000/api/tour-plans/get-all-tour-plans-for-search-by-state/${stateName}`
        );
        const { startPlaces, destinations, durations } = response.data;

        setStartPlaces(
          startPlaces.map((place) => ({ id: place._id, name: place.name }))
        );
        setDestinations(
          destinations.map((dest) => ({ id: dest._id, name: dest.name }))
        );
        setDurations(
          durations.map(
            (dur) => `${dur} Days / ${dur - 1} Night${dur > 2 ? "s" : ""}`
          )
        );
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [stateName]);

  const handleSearch = async () => {
    const days = parseInt(duration?.split(" ")[0], 10);
    console.log("Search triggered with:", {
      startPlace,
      destination,
      duration: days,
    });
    try {
      const response = await axios.get(
        `http://localhost:3000/api/tour-plans/tour-plans/state/${encodeURIComponent(
          stateName
        )}?from=${startPlace}&duration=${days}`
      );

      const { address, tourPlans } = response.data;
      setStateData(address || {}); // Set address details
      setPackages(tourPlans || []); // Set all packages

      // Filter top 5 packages with itTop === "Y"
      const topPackagesData = (tourPlans || [])
        .filter((pkg) => pkg.itTop === "Y")
        .slice(0, 5);
      setTopPackages(topPackagesData);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching state data");
    }
  };
  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }
  if (!stateData) {
    return <div className="text-center">Loading state details...</div>;
  }
  // Extract stateImage path and construct URL dynamically
  const stateImagePath = stateData.images?.[0] || "";
  const parts = stateImagePath.split("\\"); // Split path by backslashes
  let fileName = "";
  let stateQuery = stateName.toLowerCase(); // Use stateName from URL params

  if (parts.length >= 2) {
    fileName = parts.pop(); // Extract the file name
  } else {
    console.warn("Unexpected stateImage format:", stateImagePath);
  }
  const stateImageURL = `http://localhost:3000/api/address/get-image?state=${encodeURIComponent(
    stateQuery
  )}&fileName=${encodeURIComponent(fileName)}`;

  return (
    <div className="state-page">
      {/* State Header */}
      <div
        className="state-header"
        style={{
          backgroundImage: `url(${stateImageURL})`,
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
            backgroundColor: "white",
            padding: "8px",
            borderRadius: "10px",
            top: "20px",
            right: "20px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#fff",
            fontSize: "18px",
          }}
        >
          <span className="text-dark">Need Quick Quote?</span>
          <a href="tel:+919944940051" style={{ color: "#fff" }}>
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
            {packages.length} Tour Plans Available
          </p>
          <h1 className="state-name">{stateData.state}</h1>
          <p className="starting-price">
            Starting from ₹{stateData.startingPrice}
          </p>
        </div>
      </div>

      {/* State Description */}
      <div className="container mt-4">
        <p
          className={`state-description ${
            showFullDescription ? "expanded" : "collapsed"
          }`}
          dangerouslySetInnerHTML={{
            __html: showFullDescription
              ? stateData.description
              : stateData.description.split("<br>").slice(0, 5).join("<br>"),
          }}
        ></p>
        <button
          className="btn btn-link read-more-toggle"
          onClick={() => setShowFullDescription((prev) => !prev)}
        >
          {showFullDescription ? "Read Less" : "Read More"}
        </button>
        <button
          className="btn"
          style={{
            backgroundColor: "#ef156c",
            float: "right",
            color: "white",
            marginTop: "5px",
            minWidth: "150px",
          }}
          onClick={() =>
            navigate(`/details/${stateData?.state}/${stateData?.city}`)
          }
        >
          Places to visit in {stateName}
        </button>
      </div>

      {/* Top 5 Packages Table */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Top 5 Packages in {stateName}</h2>
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
            {topPackages.length > 0 ? (
              topPackages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.title}</td>
                  <td>
                    {pkg.duration} Days / {Math.max(pkg.duration - 1, 1)} Nights
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
      <div className=" container d-flex gap-3 mt-2 mb-3">
        {/* Start Place Field */}
        <div className="col-12 col-md-4 col-lg-2  d-flex align-items-center">
          <FontAwesomeIcon
            icon={faMapMarkerAlt}
            className="me-2"
            style={{ color: "#ef156c" }}
          />
          <select
            className="form-select"
            style={{ fontSize: "14px" }}
            value={startPlace}
            onChange={(e) => setStartPlace(e.target.value)}
          >
            <option value="" disabled>
              Start Place
            </option>
            {startPlaces.map((place) => (
              <option key={place.id} value={place.id}>
                {place.name}
              </option>
            ))}
          </select>
        </div>

        {/* Duration Field */}
        <div className="col-12 col-md-4 col-lg-2  d-flex align-items-center">
          <FontAwesomeIcon
            icon={faClock}
            className="me-2"
            style={{ color: "#ef156c" }}
          />
          <select
            className="form-select"
            style={{ fontSize: "14px" }}
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          >
            <option value="" disabled>
              Duration
            </option>
            {durations.map((dur, index) => (
              <option key={index} value={dur}>
                {dur}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <div className="col-lg-2">
          <button
            className="btn w-100 d-flex align-items-center text-white justify-content-center"
            style={{ backgroundColor: "#ef156c" }}
            onClick={handleSearch}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="me-2"
              style={{ color: "white" }}
            />
            Search
          </button>
        </div>
      </div>
      {/* Packages Grid */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">
          {packages.length > 0
            ? `All Packages in ${stateName}`
            : `No Tour Plans Found for ${stateName}`}
        </h2>
        {packages.length > 0 ? (
          <div className="row">
            {packages.map((tourPlan) => (
              <div key={tourPlan._id} className="col-md-6 col-lg-4 mb-4">
                <PackageCard tourPlan={tourPlan} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted"></div>
        )}
      </div>
      <div className="mt-4">
        <ReviewForState stateName={stateName}/>
      </div>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
    </div>
  );
};

export default StatePage;
