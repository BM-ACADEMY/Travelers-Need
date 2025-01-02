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
import { jwtDecode } from "jwt-decode";
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
const destinations = ["Paris", "Bali", "New York"];
const durations = ["3 Days", "1 Week", "2 Weeks"];
const months = ["January", "February", "March"];

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
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [month, setMonth] = useState("");
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${baseurl}/reviews/get-all-reviews`, {
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
        `${baseurl}/tour-plans/get-all-tour-plans`
      );

      const { data, trendingCategories } = response.data; // Destructure response data

      // Update state based on response
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
      const response = await axios.get(`${baseurl}/themes/get-all-themes`);
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

  // useEffect(() => {
  //   const token = sessionStorage.getItem(secretKey);
  //   if (!token) {
  //     console.log("No token found. Redirecting to Sign In...");
  //     // navigate("/signIn");
  //     return;
  //   }

  //   try {
  //     const decoded = jwtDecode(token);
  //     if (decoded.exp * 1000 < Date.now()) {
  //       console.log("Token has expired.");
  //       sessionStorage.removeItem(secretKey);
  //       // navigate("/signIn");
  //     }
  //   } catch (error) {
  //     console.error("Error decoding token:", error.message);
  //     // navigate("/signIn");
  //   }
  // }, []);

  useEffect(() => {
    fetchReviews();
    fetchPackages();
    fetchThemes();
  }, []);

  const renderStars = (rating) => "★".repeat(rating) + "☆".repeat(5 - rating);

  const handleReadMore = () => {
    navigate("/read-review");
  };
  const handleWriteReview = () => {
    navigate("/write-review");
  };

  return (
    <div className="app-container">
      <div className="container-fluid hero-section d-flex flex-column position-relative">
        <div className="row align-items-center justify-content-center">
          {/* Left Image */}
          <div className="col-lg-3 d-none d-lg-block">
            <img
              src={leftImage}
              alt="Left Illustration"
              className="img-fluid"
            />
          </div>

          {/* Main Content */}
          <div className="col-12 col-lg-6 text-center">
            <h1 className="fw-bold mb-3">
              Customize & Book Amazing Holiday Packages
            </h1>
            <p className="text-muted mb-4">
              650+ Travel Agents serving 65+ Destinations worldwide
            </p>

            {/* Dropdown Fields */}
            <div className="row g-3">
              {/* Destination Field */}
              <div className="col-12 col-md-6 col-lg-3 d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faMapMarkerAlt}
                  className="me-2"
                  style={{ color: "#ef156c" }}
                />
                <select
                  className="form-select"
                  style={{
                    fontSize: "14px",
                  }}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                >
                  <option value="" disabled>
                    Destination
                  </option>
                  {destinations.map((dest, index) => (
                    <option key={index} value={dest}>
                      {dest}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Field */}
              <div className="col-12 col-md-6 col-lg-3 d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faClock}
                  className="me-2"
                  style={{ color: "#ef156c" }}
                />
                <select
                  className="form-select"
                  style={{
                    fontSize: "14px", // Decrease the size of the entire dropdown text
                  }}
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

              {/* Month Field */}
              <div className="col-12 col-md-6 col-lg-3 d-flex align-items-center">
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="me-2"
                  style={{ color: "#ef156c" }}
                />
                <select
                  className="form-select"
                  value={month}
                  style={{
                    fontSize: "14px", // Decrease the size of the entire dropdown text
                  }}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option value="" disabled>
                    Select Month
                  </option>
                  {months.map((m, index) => (
                    <option key={index} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Explore Button */}
              <div className="col-12 col-md-6 col-lg-3">
                <button
                  className="btn    w-100 d-flex align-items-center text-white justify-content-center"
                  style={{ backgroundColor: "#ef156c" }}
                >
                  <FontAwesomeIcon
                    icon={faSearch}
                    className="me-2"
                    style={{ color: "white" }}
                  />
                  Explore
                </button>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="col-lg-3 d-none d-lg-block">
            <img
              src={rightImage}
              alt="Right Illustration"
              className="img-fluid"
            />
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
    </div>
  );
};

export default Home;
