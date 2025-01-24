import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "lightbox2/dist/css/lightbox.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faClock,
  faGlobe,
  faCalendar,
  faCalendarAlt,
  faCity,
  faWifi,
  faPhone,
  faLanguage,
  faLightbulb,
  faTemperatureHigh,
  faTemperatureLow,
  faCloudSun,
} from "@fortawesome/free-solid-svg-icons";
import HowToReach from "./HowToReach";
import { useNavigate } from "react-router-dom";
import PlaceCard from "./PlaceCard";
import ReusableModal from "../model/ReusableModel";
import QuoteForm from "../model/QuoteForm";



const PackageDetailsPage = () => {
  const { stateName, cityName } = useParams();
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("overview");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [mustVisitPlace, setMustvisitPlace] = useState([]);
  const [topPackages, setTopPackages] = useState([]);
  const [stateData, setStateData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigator = useNavigate();

  var BASE_URL = import.meta.env.VITE_BASE_URL;
  const constructImageURL = (imagePath) => {
    const parts = imagePath?.split("\\");
    let placeName = "";
    let fileName = "";
  
    if (parts?.length >= 2) {
      placeName = parts[0];
      fileName = parts[1];
    } else {
      console.warn("Unexpected image path format:", imagePath);
    }
  
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

  useEffect(() => {
    if (placeDetails?.parentCity?.weatherInfo?.nearestCity) {
      fetchWeatherData(placeDetails?.parentCity?.weatherInfo?.nearestCity);
    }
  }, [placeDetails]);
  useEffect(() => {
    // Dynamically import lightbox2 and configure it
    import("lightbox2").then((lightbox) => {
      lightbox.option({
        resizeDuration: 200,
        wrapAround: true,
        showImageNumberLabel: true, // Show current image index
        alwaysShowNavOnTouchDevices: true, // Ensure navigation is visible
      });
    });
  }, []);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/places/details?stateName=${stateName}&cityName=${cityName}`
        );
        const fetchedPlaceDetails = response.data?.data || null;
        setPlaceDetails(fetchedPlaceDetails);
        if (fetchPlaceDetails) {
          fetchStateData();
        }
        // Extract and filter must-visit places
        const allSubPlaces = fetchedPlaceDetails?.allSubPlaces || [];
        const filteredMustVisit = allSubPlaces.filter(
          (place) => place.mustVisit === "Y"
        );
        setMustvisitPlace(filteredMustVisit);
      } catch (error) {
        console.error("Error fetching place details:", error);
        setPlaceDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [stateName, cityName]);
  const fetchStateData = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tour-plans/tour-plans/tour-packages/${encodeURIComponent(
          stateName
        )}`
      );

      console.log(response.data);

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
  const fetchWeatherData = async () => {
    setLoadingWeather(true);
    try {
      const apiKey = "24534f099fafa04ef4f0552a66ba8a82"; // Replace with your OpenWeatherMap API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&APPID=${apiKey}`
      );

      if (response?.data) {
        setCurrentWeather({
          temp: response.data.main.temp,
          tempMin: response.data.main.temp_min,
          tempMax: response.data.main.temp_max,
          description: response.data.weather[0].description,
        });
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setCurrentWeather(null);
    } finally {
      setLoadingWeather(false);
    }
  };
  const handleViewDetails = (place) => {
    // Logic to handle viewing details (e.g., navigate to a detailed page)
    console.log("Viewing details for:", place.name);
  };

  const handleNavigateToTourPlan = () => {
    navigator(`/state/${encodeURIComponent(stateName)}`);
  };
  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!placeDetails) {
      return <div>No data available for this section.</div>;
    }

    const { parentCity } = placeDetails;

    switch (selectedOption) {
      case "overview":
        return (
          <div className="overview-section">
            <div className="w-100 d-flex flex-column flex-md-row gap-5">
              {/* About Information */}
              <div className="info-block flex-grow-1">
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faGlobe}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Country:
                  </strong>{" "}
                  {parentCity.address?.country || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faMapMarkerAlt}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    State:
                  </strong>{" "}
                  {parentCity.address?.state || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faClock}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Ideal Trip Duration:
                  </strong>{" "}
                  {parentCity.idealTripDuration || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faCity}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Nearest City:
                  </strong>{" "}
                  {parentCity.weatherInfo?.nearestCity || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faCalendarAlt}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Best Time to Visit:
                  </strong>{" "}
                  {parentCity.bestTimetoVisit || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Peak Season:
                  </strong>{" "}
                  {parentCity.weatherInfo?.peakSeason || "N/A"}
                </p>
              </div>

              {/* Additional Information */}
              <div className="additional-info flex-grow-1">
                <h5>Other Information</h5>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faWifi}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Internet Availability:
                  </strong>{" "}
                  {parentCity.networkSettings?.internetAvailability || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faPhone}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    STD Code:
                  </strong>{" "}
                  {parentCity.networkSettings?.stdCode || "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faLanguage}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Languages Spoken:
                  </strong>{" "}
                  {parentCity.networkSettings?.languageSpoken?.join(", ") ||
                    "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faCalendar}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Major Festivals:
                  </strong>{" "}
                  {parentCity.networkSettings?.majorFestivals?.join(", ") ||
                    "N/A"}
                </p>
                <p>
                  <strong>
                    <FontAwesomeIcon
                      icon={faLightbulb}
                      className="me-2"
                      style={{ color: "#ef156c" }}
                    />
                    Notes or Tips:
                  </strong>{" "}
                  {parentCity.networkSettings?.notesOrTips || "N/A"}
                </p>
              </div>
            </div>

            {/* Description Section */}
            <div className="description mt-4">
              <h5>About {parentCity.name}</h5>
              <div className="container mt-4">
                <p
                  className={`state-description ${
                    showFullDescription ? "expanded" : "collapsed"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: showFullDescription
                      ? parentCity.description
                      : parentCity.description
                          .split("<br>")
                          .slice(0, 5)
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
            </div>
          </div>
        );
      case "top-places":
        return (
          <div className="row">
            {placeDetails?.allSubPlaces.map((place, index) => (
              <div key={place.id} className="col-md-4">
                <PlaceCard
                  place={place}
                  index={index}
                  totalCount={placeDetails?.allSubPlaces?.length}
                  onViewDetails={handleViewDetails}
                />
              </div>
            ))}
          </div>
        );
      case "best-places":
        return navigator(`/tour-packages/${encodeURIComponent(stateName)}`);
      case "best-time":
        return (
          <div className="best-time-container">
            <h5 className="section-title">Best Time to Visit</h5>
            <h6 className="section-title">Seasons</h6>
            <div className="season-container">
              {parentCity?.weatherInfo?.season?.map((season, index) => (
                <div key={index} className="season-card d-flex flex-column">
                  <h6>{season.title}</h6>
                  <p>{season.description}</p>
                </div>
              ))}
            </div>

            {/* Current Weather Section */}
            <h6 className="section-title">
              Current Weather in {parentCity?.weatherInfo?.nearestCity || "N/A"}
            </h6>
            {loadingWeather ? (
              <p>Loading weather data...</p>
            ) : currentWeather ? (
              <div className="weather-info">
                <p>
                  <FontAwesomeIcon
                    icon={faCloudSun}
                    style={{ color: "#ef156c", marginRight: "8px" }}
                  />
                  <strong>Condition:</strong> {currentWeather.description}
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faTemperatureHigh}
                    style={{ color: "#ef156c", marginRight: "8px" }}
                  />
                  <strong>Max Temperature:</strong> {currentWeather.tempMax}°C
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faTemperatureLow}
                    style={{ color: "#ef156c", marginRight: "8px" }}
                  />
                  <strong>Min Temperature:</strong> {currentWeather.tempMin}°C
                </p>
                <p>
                  <FontAwesomeIcon
                    icon={faCloudSun}
                    style={{ color: "#ef156c", marginRight: "8px" }}
                  />
                  <strong>Current Temperature:</strong> {currentWeather.temp}°C
                </p>
              </div>
            ) : (
              <p>
                No weather data available for{" "}
                {parentCity?.weatherInfo?.nearestCity || "N/A"}.
              </p>
            )}
          </div>
        );
      case "how-to-reach":
        return (
          <HowToReach transportData={placeDetails?.parentCity?.transport} />
        );
      default:
        return <div>Select an option to view details.</div>;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!placeDetails) {
    return <div>No place details found.</div>;
  }
  const { parentCity } = placeDetails;
  // setMustvisitPlace(placeDetails?.allSubPlaces)
  const imageURLs = parentCity.images?.map((imagePath) =>
    constructImageURL(imagePath)
  );

  return (
    <div className="container mt-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">{parentCity.address.country}</li>
          <li className="breadcrumb-item">{stateName}</li>
          <li className="breadcrumb-item active" aria-current="page">
            {cityName}
          </li>
        </ol>
      </nav>

      <div className="row d-flex flex-column flex-md-row g-2">
        {/* Left Column: Main Image + Gallery View */}
        <div className="col-md-6 position-relative">
          {imageURLs?.length > 0 && (
            <div
              style={{
                position: "relative",
                height: "300px",
                backgroundImage: `url(${imageURLs[0]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Center Title */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  color: "white",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
                  fontSize: "20px",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {parentCity.placeTitle}
              </div>

              {/* View Gallery Button */}
              <div
                className="position-absolute"
                style={{
                  bottom: "10px",
                  left: "10px",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "#fff",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // Start Lightbox from the first image and include all images
                  imageURLs.forEach((url, index) => {
                    const tempLink = document.createElement("a");
                    tempLink.href = url;
                    tempLink.dataset.lightbox = "gallery";
                    tempLink.dataset.title = `Image ${index + 1}`;
                    tempLink.style.display = "none";
                    document.body.appendChild(tempLink);
                    if (index === 0) tempLink.click(); // Start from the first image
                    document.body.removeChild(tempLink);
                  });
                }}
              >
                View Gallery
              </div>

              {/* Preload all images for the Lightbox */}
              {imageURLs.map((url, index) => (
                <a
                  key={index}
                  href={url}
                  data-lightbox="gallery"
                  data-title={`Image ${index + 1}`}
                  style={{ display: "none" }}
                >
                  Hidden Link for Lightbox
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Options and Content */}
        <div className="col-md-6">
          <div className="list-group">
            {[
              { label: "Overview", value: "overview" },
              { label: "Top Places", value: "top-places" },
              { label: "Best Places", value: "best-places" },
              { label: "Best Time to Visit", value: "best-time" },
              { label: "How to Reach", value: "how-to-reach" },
            ].map((item) => (
              <button
                key={item.value}
                className={`list-group-item list-group-item-action ${
                  selectedOption === item.value ? "active" : ""
                }`}
                onClick={() => setSelectedOption(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 row">{renderContent()}</div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="row">
            <h4>Top {mustVisitPlace.length} Places to Visit in Pondicherry</h4>
            {mustVisitPlace.length > 0 ? (
              mustVisitPlace.map((place, index) => (
                <div key={place.id} className="col-md-4">
                  <PlaceCard
                    place={place}
                    index={index}
                    totalCount={mustVisitPlace.length}
                    onViewDetails={() =>
                      console.log(`Viewing details for ${place.name}`)
                    }
                  />
                </div>
              ))
            ) : (
              <p>No must-visit places found.</p>
            )}
          </div>
        )}
      </div>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Top 5 Packages in {stateName}</h2>
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
      </div>
      <a
        onClick={handleNavigateToTourPlan}
        className="btn btn-danger"
        style={{ backgroundColor: "#ef156c", textAlign: "center" }}
      >
        All {stateName} Tour Plans
      </a>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
    </div>
  );
};

export default PackageDetailsPage;
