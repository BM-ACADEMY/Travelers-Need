import React, { useEffect, useRef, useState } from "react";
import leftImage from "../../images/gif-1.gif";
import rightImage from "../../images/gif-2.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faCalendarAlt,
  faSearch,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Home/Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Trending_category from "../Categories/Trending_category";
import Top_category from "../Categories/Top_category";
import Honeymoon_category from "../Categories/Honeymoon_category";
import Hillstations_category from "../Categories/Hillstations_category";
import Pilgrimage_category from "../Categories/Pilgrimage_category";
import Heritage_category from "../Categories/Heritage_category";
import Beach_category from "../Categories/Beach_category";
import Themes_category from "../Categories/Themes_category";
import Wildlife_category from "../Categories/Wildlife_category";
import MapComponent from "../../components/MapComponent";
import ReusableModal from "../model/ReusableModel";
import QuoteForm from "../model/QuoteForm";

const Home = () => {
  const navigate = useNavigate();
  const [trendingData, setTrendingData] = useState({});
  const [topDestinationsData, setTopDestinationsData] = useState({});
  const [honeymoonData, setHoneymoonData] = useState({});
  const [wildlifeData, setWildlifeData] = useState({});
  const [hillStationsData, setHillStationsData] = useState({});
  const [pilgrimageData, setPilgrimageData] = useState({});
  const [heritageData, setHeritageData] = useState({});
  const [beachData, setBeachData] = useState({});
  const [themesData, setThemesData] = useState({});
  const [categories, setCategories] = useState({});
  const [error, setError] = useState(null);
  const secretKey = "userData";
  const baseurl = import.meta.env.VITE_BASE_URL;
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const swiperRef = useRef(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [startPlaces, setStartPlaces] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [durations, setDurations] = useState([]);
  const [startPlace, setStartPlace] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  var BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/tour-plans/get-all-tour-plans-for-search`
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
  }, []);
  const handleSearch = () => {
    const days = parseInt(duration.split(" ")[0], 10);

    console.log("Search triggered with:", {
      startPlace,
      destination,
      duration: days,
    });
    navigate(
      `tour-packages/${encodeURIComponent(
        destination
      )}?from=${startPlace}&duration=${days}`
    );
  };
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/reviews/get-all-reviews`, {
        params: { page, limit: 10 },
      });

      const { reviews: fetchedReviews, totalPages } = response.data;

      // Update the state with fetched reviews
      setReviews((prevReviews) => [...prevReviews, ...fetchedReviews]);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    }
  };

  const fetchPackages = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/tour-plans/get-all-tour-plans`
      );
      const { data, trendingCategories } = response.data;
      if (data) {
        setTrendingData(trendingCategories || []); // Trending categories data
        const categoryMap = data.reduce((acc, category) => {
          acc[category.category] = category.states || [];
          return acc;
        }, {});

        setTopDestinationsData(categoryMap["Top_destinations"] || []);
        setHoneymoonData(categoryMap["Honeymoon"] || []);
        setWildlifeData(categoryMap["Wildlife"] || []);
        setHillStationsData(categoryMap["Hill_stations"] || []);
        setPilgrimageData(categoryMap["Pilgrimage"] || []);
        setHeritageData(categoryMap["Heritage"] || []);
        setBeachData(categoryMap["Beach"] || []);
      }
    } catch (error) {
      console.error("Error fetching packages:", error.message);
    }
  };

  const fetchThemes = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/themes/get-all-themes-by-tour-plan`
      );
      const { data } = response.data;
      console.log(data);

      if (data) {
        setThemesData(data);
      } else {
        setTrendingData({});
      }
    } catch (error) {
      console.error("Error fetching packages:", error.message);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsModalOpen(true);
    }, 5000); // Show modal after 3 seconds

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);
  useEffect(() => {
    fetchReviews();
    fetchPackages();
    fetchThemes();
  }, []);
  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (formData) => closeModal();

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  const handleReadMore = () => {
    navigate("/reviews");
  };
  const handleWriteReview = () => {
    navigate("/write-review");
  };

  return (
    <div className="app-container">
      <div className="container-fluid hero-section d-flex flex-column position-relative">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between">
            {/* Left Image */}
            <div
              className="d-none d-lg-block"
              style={{ flex: "1", textAlign: "left" }}
            >
              <img
                src={leftImage}
                alt="Left Illustration"
                className="img-fluid"
                style={{ maxWidth: "100%" }}
              />
            </div>

            {/* Main Content */}
            <div
              className="d-flex flex-column align-items-center justify-content-center text-center"
              style={{ flex: "3" }}
            >
              <h1 className="fw-bold mb-3">
                Customize & Book Amazing Holiday Packages
              </h1>
              <p className="text-muted mb-4">
                650+ Travel Agents serving 65+ Destinations worldwide
              </p>

              {/* Dropdown Fields */}
              <div className="row g-3 d-flex flex-column flex-md-row align-items-center w-100">
                {/* Start Place Field */}
                <div className="col-12 col-md-4 col-lg-3 d-flex align-items-center">
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

                {/* Destination Field */}
                <div className="col-12 col-md-4 col-lg-3 d-flex align-items-center">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="me-2"
                    style={{ color: "#ef156c" }}
                  />
                  <select
                    className="form-select"
                    style={{ fontSize: "14px" }}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  >
                    <option value="" disabled>
                      Destination
                    </option>
                    {destinations.map((dest) => (
                      <option key={dest.id} value={dest.name}>
                        {dest.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Field */}
                <div className="col-12 col-md-4 col-lg-3 d-flex align-items-center">
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
                <div className="col-12 col-md-4 col-lg-3">
                  <button
                    className="btn w-100 d-flex align-items-center justify-content-center text-white"
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
            </div>

            {/* Right Image */}
            <div
              className="d-none d-lg-block"
              style={{ flex: "1", textAlign: "right" }}
            >
              <img
                src={rightImage}
                alt="Right Illustration"
                className="img-fluid"
                style={{ maxWidth: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="container mt-5">
          <div className="container mt-5 review-carousel">
            <div className="d-flex justify-content-center flex-column">
              <h1 className="text-center text-dark mb-4">
                Over 40 Lac+ Happy Travelers
              </h1>
              <p className="text-dark text-center">
                Real travelers. Real stories. Real opinions to help you make the
                right choice.
              </p>
            </div>

            {/* Custom Navigation Buttons */}
            <div className="custom-navigation">
              <button
                ref={prevRef}
                className="btn prev-button"
                style={{ color: "#ef156c" }}
              >
                &#9664; {/* Left Arrow */}
              </button>
              <button
                ref={nextRef}
                className="btn next-button"
                style={{ color: "#ef156c" }}
              >
                &#9654; {/* Right Arrow */}
              </button>
            </div>

            {/* Swiper Slider */}
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              slidesPerView={2}
              spaceBetween={30}
              pagination={false} // Disable bullet points
              breakpoints={{
                0: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
              }}
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="card p-3 shadow-sm">
                    <div className="d-flex justify-content-between mb-3">
                      {/* Avatar and Name */}
                      <div className="d-flex align-items-center">
                        <div
                          className="avatar me-3 text-white d-flex align-items-center justify-content-center rounded-circle"
                          style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: "#ef156c",
                          }}
                        >
                          {review.name?.charAt(0).toUpperCase() || "?"}{" "}
                          {/* First letter of name */}
                        </div>
                        <div>
                          <h5 className="mb-0">{review.name || "Anonymous"}</h5>
                          <small className="text-muted">
                            {review?.tourPlan?.title || "N/A"}{" "}
                            {/* Package title */}
                          </small>
                        </div>
                      </div>
                      {/* Date */}
                      <div className="text-muted small">
                        {new Date(review.createdAt).toLocaleDateString()}{" "}
                        {/* Format Date */}
                      </div>
                    </div>
                    {/* Rating */}
                    <div className="rating mb-3 text-muted">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span
                          key={index}
                          style={{
                            color:
                              index < review.tourRating ? "#ffc107" : "#e4e5e9",
                            fontSize: "18px",
                          }}
                        >
                          ★
                        </span>
                      ))}{" "}
                      {/* Dynamic Rating */}
                    </div>
                    {/* Comments */}
                    <p
                      className="fw-bold mb-2"
                      style={{
                        maxHeight: "4.4em", // Height for 3 lines
                        overflowY: "auto", // Add vertical scrollbar for overflow
                        whiteSpace: "pre-line",
                        wordBreak: "break-word",
                      }}
                    >
                      {review.comments}
                    </p>

                    {/* Package Details */}
                    <p>
                      <strong>Package:</strong>{" "}
                      {review?.tourPlan?.title || "N/A"}
                    </p>
                    {/* <p>
                      <strong>Duration:</strong>{" "}
                      {review?.tourPlan?.duration || "N/A"} Days
                    </p> */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Read More and Write Review Buttons */}
            <div className="d-flex justify-content-center mt-4 gap-3">
              <button
                className="btn"
                onClick={handleReadMore}
                style={{
                  border: "2px solid #ef156c",
                  color: "#ef156c",
                  textTransform: "none",
                }}
              >
                Read More Reviews
              </button>

              <button
                className="btn text-white"
                onClick={handleWriteReview}
                style={{
                  backgroundColor: "#ef156c",
                  textTransform: "none",
                }}
              >
                Write Review
              </button>
            </div>
          </div>
          <Trending_category trendingData={trendingData} />
          <Themes_category themesData={themesData} />
          <Top_category topDestinationsData={topDestinationsData} />
          <Honeymoon_category honeymoonData={honeymoonData} />
          <Wildlife_category wildlifeData={wildlifeData} />
          <Hillstations_category hillStationsData={hillStationsData} />
          <Pilgrimage_category pilgrimageData={pilgrimageData} />
          <Heritage_category heritageData={heritageData} />
          <Beach_category beachData={beachData} />
          <div style={{ height: "65vh" }}>
            <MapComponent />
          </div>
        </div>
      </div>
      <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
    </div>
  );
};

export default Home;
