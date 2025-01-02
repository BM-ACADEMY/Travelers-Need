import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faTrain, faPlane } from "@fortawesome/free-solid-svg-icons";
import "lightbox2/dist/css/lightbox.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "../Destinations/PackageDetailsPage.css";

const PackageDetailsPage = () => {
  const { packageId } = useParams();
  const [selectedOption, setSelectedOption] = useState("overview"); // Default option
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [packageDetails, setPackageDetails] = useState(null);
  const [showFullText, setShowFullText] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [cityName, setCityName] = useState("");

  useEffect(() => {
    // Dynamically import lightbox2 and configure options
    import("lightbox2").then((lightbox) => {
      lightbox.option({
        resizeDuration: 200,
        wrapAround: true,
        showImageNumberLabel: true,
      });
    });
  }, []);

  // Fetch package details
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/packages/get-package-by-id/${packageId}`
        );
        setPackageDetails(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  // Fetch dynamic content based on selectedOption
  useEffect(() => {
    const fetchDynamicContent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3000/api/packages/get-package-by-id-with-filter/${packageId}`,
          { params: { type: selectedOption } }
        );

        // Ensure the response data is valid and update the state
        if (response.data?.data) {
          setContentData(response.data.data);
          // setCity(contentData.address?.city )
          console.log("Fetched Data:", response.data.data, "sdfdf");
        } else {
          setContentData(null);
          console.error("Invalid response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching dynamic content:", error);
        setContentData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDynamicContent();
  }, [packageId, selectedOption]);
  useEffect(() => {
    if (contentData && contentData.address?.city) {
      setCityName(contentData.address.city); // Set city name from overview response
    }
  }, [contentData]);

  useEffect(() => {
    if (cityName) {
      fetchWeatherData();
    }
  }, [cityName]);

  // Fetch weather data dynamically based on the city name

  const fetchWeatherData = async () => {
    if (!cityName) return; // Only fetch if city name is available

    setLoadingWeather(true);
    try {
      const apiKey = "e83b4d8130ffb4356f8450dd965ab046"; // Replace with your API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(null);
    } finally {
      setLoadingWeather(false);
    }
  };
  const renderContent = () => {
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!contentData) {
      return <div>No data available for this section.</div>;
    }

    switch (selectedOption) {
      case "overview":
        if (!contentData) return <div>Loading...</div>;

        const truncatedText = contentData.packageDescription
          ? `${contentData.packageDescription
              .split(" ")
              .slice(0, 50)
              .join(" ")}...`
          : "No description available.";

        return (
          <div className="container">
            <h5>About Munnar</h5>

            {/* General Info Section */}
            <div className="row mb-4">
              <div className="col-md-6">
                <p>
                  <strong>
                    <i className="bi bi-geo-alt icon"></i> Country:{" "}
                  </strong>
                  {contentData.address?.country || "N/A"}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-geo-alt icon"></i> State:{" "}
                  </strong>
                  {contentData.address?.state || "N/A"}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-pin-map icon"></i> City:{" "}
                  </strong>
                  {contentData.address?.city || "N/A"}
                </p>
              </div>
            </div>

            {/* Additional Information Section */}
            <div className="row mb-4">
              <div className="col-md-6">
                <p>
                  <strong>
                    <i className="bi bi-clock icon"></i> Ideal Trip Duration:{" "}
                  </strong>
                  {contentData.tripDuration || "N/A"}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-geo icon"></i> Nearest City:{" "}
                  </strong>
                  {contentData.nearestCity || "N/A"}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>
                    <i className="bi bi-calendar icon"></i> Best Time to Visit:{" "}
                  </strong>
                  {contentData.bestTimeToVisit?.season
                    ?.map((season) => season.title)
                    .join(", ") || "N/A"}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-calendar-event icon"></i> Peak Season:{" "}
                  </strong>
                  {contentData.peakSeason || "N/A"}
                </p>
              </div>
            </div>

            {/* Description Section with Read More */}
            <div>
              <strong>
                <i className="bi bi-calendar icon"></i> Description{" "}
              </strong>
              <p style={{ overflow: "hidden" }}>
                {showFullText ? contentData.packageDescription : truncatedText}
              </p>
              <button
                className="btn btn-link p-0"
                onClick={() => setShowFullText(!showFullText)}
              >
                {showFullText ? "Read Less" : "Read More"}
              </button>
            </div>

            {/* Festivals, Language, and Notes */}
            <div className="row mt-4">
              <div className="col-md-6">
                <p>
                  <strong>
                    <i className="bi bi-translate icon"></i> Languages Spoken:{" "}
                  </strong>
                  {contentData.networkSettings?.languageSpoken?.join(", ") ||
                    "N/A"}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-calendar2-event icon"></i> Major
                    Festivals:{" "}
                  </strong>
                  {contentData.networkSettings?.majorFestivals?.join(", ") ||
                    "N/A"}
                </p>
              </div>
              <div className="col-md-6">
                <p>
                  <strong>
                    <i className="bi bi-wifi icon"></i> Internet Availability:{" "}
                  </strong>
                  {contentData.networkSettings?.internetAvailability || "N/A"}
                </p>
                <p>
                  <strong>
                    <i className="bi bi-lightbulb icon"></i> Notes or Tips:{" "}
                  </strong>
                  {contentData.networkSettings?.notesOrTips || "N/A"}
                </p>
              </div>
            </div>
          </div>
        );

      case "top-places":
        return (
          <div>
            <h5>Top Places to Visit</h5>
            <ul>
              {contentData.topPlaces?.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
          </div>
        );
      case "best-places":
        return (
          <div>
            <h5>Best Places to Visit</h5>
            <ul>
              {contentData.bestPlaces?.map((place, index) => (
                <li key={index}>{place}</li>
              ))}
            </ul>
          </div>
        );
      case "best-time":
       
        // Render content for "Best Time to Visit"
        return (
          <div className="best-time-container">
            <h5 className="section-title">Best Time to Visit</h5>
            <h6 className="section-title">Seasons</h6>
            <div className="season-container">
              {contentData?.bestTimeToVisit?.season?.map((season, index) => (
                <div key={index} className="season-card d-flex flex-column">
                  <h6>{season.title}</h6>
                  <p>{season.description}</p>
                </div>
              ))}
            </div>
            <h6 className="section-title">Current Weather in {cityName}</h6>
            {loadingWeather ? (
              <p>Loading weather data...</p>
            ) : weatherData ? (
              <div className="weather-info">
                <p>
                  <strong>Temperature:</strong> {weatherData.main.temp}°C
                </p>
                <p>
                  <strong>Feels Like:</strong> {weatherData.main.feels_like}°C
                </p>
                <p>
                  <strong>Humidity:</strong> {weatherData.main.humidity}%
                </p>
                <p>
                  <strong>Condition:</strong>{" "}
                  {weatherData.weather[0].description}
                </p>
              </div>
            ) : (
              <p>No weather data available for {cityName}.</p>
            )}
          </div>
        );
      case "how-to-reach":
        if (!contentData || !contentData.howToReach) {
          return <div>Loading...</div>;
        }

        // Separate data for different modes of transportation
        const busData = contentData.howToReach.filter(
          (item) => item.mode === "Bus"
        );
        const trainData = contentData.howToReach.filter(
          (item) => item.mode === "Train"
        );
        const airData = contentData.howToReach.filter(
          (item) => item.mode === "Air"
        );

        const renderTable = (data, mode, icon) => (
          <div className="mb-4">
            <h6
              className="d-flex align-items-center mb-3"
              style={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              <FontAwesomeIcon
                icon={icon}

                style={{ marginRight: 8, color: "#ef156c" }}
              />{" "}
              By {mode}
            </h6>
            {data.length > 0 ? (
              <table className="table table-striped table-bordered hover-overlay">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Distance (Kms)</th>
                    <th>Frequency</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                      <td>{item.origin || "N/A"}</td>
                      <td>{item.distance || "N/A"}</td>
                      <td>{item.frequency || "N/A"}</td>
                      <td>{item.duration || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No data available.</p>
            )}
          </div>
        );

        return (
          <div>
            {renderTable(busData, "Bus", faBus)}
            {renderTable(trainData, "Train", faTrain)}
            {renderTable(airData, "Air", faPlane)}
          </div>
        );
      default:
        return <div>Select an option to view details.</div>;
    }
  };

  if (!packageDetails) {
    return <div className="text-center mt-5">Loading package details...</div>;
  }

  const { name, images } = packageDetails;
  const packageImageURLs = (images || []).map((imagePath) => {
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const pathParts = normalizedPath.split("/");
    const packageIndex = pathParts.findIndex((part) => part === "packages");
    const packageName = packageIndex !== -1 ? pathParts[packageIndex + 1] : "";
    const fileName = pathParts.pop();

    return `http://localhost:3000/api/packages/get-package-image?packageName=${encodeURIComponent(
      packageName
    )}&fileName=${encodeURIComponent(fileName)}`;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{name}</h2>
      <div className="row">
        {/* Left Column: Single Image + Lightbox */}
        <div className="col-md-6">
          <h5>Photo Gallery</h5>
          {packageImageURLs.length > 0 && (
            <div>
              {/* Display only the first image */}
              <a
                href={packageImageURLs[0]}
                data-lightbox="gallery"
                data-title="Click to view the gallery"
              >
                <img
                  src={packageImageURLs[0]}
                  alt="Main Image"
                  className="img-fluid rounded"
                  style={{ objectFit: "cover", height: "300px", width: "100%" }}
                />
              </a>

              {/* Preload other images for the Lightbox */}
              {packageImageURLs.slice(1).map((url, index) => (
                <a
                  key={index}
                  href={url}
                  data-lightbox="gallery"
                  data-title={`Image ${index + 2}`}
                  style={{ display: "none" }}
                >
                  Hidden Link for Lightbox
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Options */}
        <div
          className="col-md-6"
          style={{ borderLeft: "1px solid #ddd", paddingLeft: "20px" }}
        >
          <div className="list-group">
            {[
              { label: "Overview", value: "overview" },
              { label: "Top Places to Visit", value: "top-places" },
              { label: "Best Places to Visit", value: "best-places" },
              { label: "Best Time to Visit", value: "best-time" },
              { label: "How to Reach", value: "how-to-reach" },
            ].map((item) => (
              <button
                key={item.value}
                className={`list-group-item list-group-item-action ${
                  selectedOption === item.value ? "active" : ""
                } option-button`}
                onClick={() => setSelectedOption(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Content Section */}
          <div className="mt-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
