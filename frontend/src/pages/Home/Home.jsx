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
import { useNavigate  } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "../Home/Home.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Container,
  
} from "@mui/material";
import ReviewCard from "../Reviews/ReviewCard";
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
const packages = [
  {
    name: "Kerala Backwaters",
    locationDetails: {
      state: "Kerala",
      city: "Alleppey",
    },
    duration: "2 to 3",
    bestMonth: "December, 2024",
  },
  {
    name: "Rajasthan Desert Safari",
    locationDetails: {
      state: "Rajasthan",
      city: "Jaisalmer",
    },
    duration: "3 to 5",
    bestMonth: "November, 2024",
  },
  {
    name: "Himachal Hill Retreat",
    locationDetails: {
      state: "Himachal Pradesh",
      city: "Manali",
    },
    duration: "1 to 2",
    bestMonth: "January, 2025",
  },
  {
    name: "Andaman Beach Getaway",
    locationDetails: {
      state: "Andaman and Nicobar Islands",
      city: "Port Blair",
    },
    duration: "3 to 4",
    bestMonth: "February, 2024",
  },
  {
    name: "Goa Party Paradise",
    locationDetails: {
      state: "Goa",
      city: "Panaji",
    },
    duration: "2 to 3",
    bestMonth: "December, 2024",
  },
];
const locations = [
  {
    stateName: "Coorg",
    coordinates: [12.4208, 75.7406],
    startingPrice: 5100,
  },
  {
    stateName: "Munnar",
    coordinates: [10.0889, 77.0595],
    startingPrice: 5000,
  },
  {
    stateName: "Pondicherry",
    coordinates: [11.9416, 79.8083],
    startingPrice: 4750,
  },
  // Add more states as needed
];

const Dropdown = ({ label, options, icon, defaultText }) => (
  <div className="col-12 col-md-3 position-relative">
    <select className="form-select form-select-lg ps-5">
      <option defaultValue>{defaultText}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    <FontAwesomeIcon
      icon={icon}
      className="position-absolute"
      style={{
        left: "15px",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#ef156c",
      }}
    />
  </div>
);


const renderStateCards = (categoryName, categoryData) => {
  const handleStateClick = (category, stateName) => {
  
  };
  return (
    <Box key={categoryName} mb={5}>
      <Typography variant="h4" align="center" sx={{ fontWeight: "bold", mb: 3, textTransform: "uppercase" }}>
        {categoryName}
      </Typography>
      <Grid container spacing={3}>
        {Object.entries(categoryData).map(([stateName, stateData]) => (
          <Grid item key={stateName} xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden", cursor: "pointer" }}
              onClick={() => handleStateClick(categoryName, stateName)}
            >
              <CardMedia
                component="img"
                height="200"
                image={`https://via.placeholder.com/200?text=${stateName}`}
                alt={stateName}
              />
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {stateName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stateData.stateInfo.description}
                </Typography>
                <Typography variant="body2" color="primary">
                  Starting at ₹{stateData.stateInfo.startingPrice}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Cities: {stateData.cities.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

// const renderCategory = (categoryName, packages) => {
//   const baseurl = import.meta.env.VITE_BASE_URL;

//   return (
//     <Box key={categoryName} mb={5}>
//       <Typography
//         variant="h4"
//         align="center"
//         sx={{ fontWeight: "bold", mb: 3, textTransform: "uppercase" }}
//       >
//         {categoryName}
//       </Typography>
//       <Grid container spacing={3}>
//         {packages && Array.isArray(packages) && packages.length > 0 ? (
//           packages.map((pkg) => {
//             // Extract filename and format image path
//             const imageFilename =
//               pkg.images && pkg.images.length > 0
//                 ? pkg.images[0].split(/[\\/]/).pop()
//                 : null;

//             const packageName = pkg.name
//               ? pkg.name.replace(/[<>:"/\\|?*\s]+/g, "-").toLowerCase()
//               : "default";

//             const imagePath = imageFilename
//               ? `${baseurl}/packages/image/${packageName}/${imageFilename}`
//               : "https://via.placeholder.com/200";

//             return (
//               <Grid item key={pkg._id} xs={12} sm={6} md={4} lg={3}>
//                 <Card sx={{ borderRadius: 2, boxShadow: 3, overflow: "hidden" }}>
//                   <CardMedia
//                     component="img"
//                     height="200"
//                     image={imagePath}
//                     alt={pkg.name || "Package Image"}
//                   />
//                   <CardContent>
//                     <Typography variant="h6" fontWeight="bold">
//                       {pkg.name}
//                     </Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {pkg.locationDetails?.state} - {pkg.locationDetails?.city}
//                     </Typography>
//                     <Typography variant="body2" color="primary">
//                       Starting at ₹{pkg.price || "N/A"}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             );
//           })
//         ) : (
//           <Typography variant="body1" color="error" align="center">
//             No packages found for this category.
//           </Typography>
//         )}
//       </Grid>
//     </Box>
//   );
// };

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
      const response = await axios.get(`${baseurl}/reviews/getAllReviews`, {
        params: { page, limit: 10 },
      });
      const { reviews: fetchedReviews, totalPages } = response.data;

      setReviews((prevReviews) => [...prevReviews, ...fetchedReviews]);
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    }
  };
  const fetchPackages = async () => {
    try {
      const response = await axios.get(`${baseurl}/packages/get-packages-by-categories`);

  
      const { data } = response.data;
      console.log(data,'home');
      
      if (data && data.TRENDING_DESTINATIONS) {
        setTrendingData(data.TRENDING_DESTINATIONS || {});
        setTopDestinationsData(data.TOP_DESTINATIONS || {});
        setHoneymoonData(data.HONEYMOON_DESTINATIONS || {});
        setWildlifeData(data.WILDLIFE_DESTINATIONS || {})
        setHillStationsData(data.HILL_STATIONS_DESTINATIONS || {});
        setPilgrimageData(data.PILGRIMAGE_DESTINATIONS || {});
        setHeritageData(data.HERITAGE_DESTINATIONS || {});
        setBeachData(data.BEACH_DESTINATIONS || {});  
   
      } else {
        console.error("TRENDING_DESTINATIONS key not found");
        setTrendingData({});
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
  
  useEffect(() => {
    const token = sessionStorage.getItem(secretKey);
    if (!token) {
      console.log("No token found. Redirecting to Sign In...");
      // navigate("/signIn");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        console.log("Token has expired.");
        sessionStorage.removeItem(secretKey);
        // navigate("/signIn");
      }
    } catch (error) {
      console.error("Error decoding token:", error.message);
      // navigate("/signIn");
    }
  }, []);

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
  const destinations = [
    ...new Set(packages.map((pkg) => pkg.locationDetails.state)),
  ];
  const durations = [...new Set(packages.map((pkg) => pkg.duration))];
  const bestMonths = [...new Set(packages.map((pkg) => pkg.bestMonth))];

  return (
    <div className="app-container">
      <div className="container-fluid hero-section d-flex flex-column position-relative">
        <div className="row align-items-center justify-content-center">
          <div className="col-lg-3 d-none d-lg-block">
            <img
              src={leftImage}
              alt="Left Illustration"
              className="img-fluid left-image"
            />
          </div>

          <div className="col-12 col-lg-6 px-3 text-content text-center">
            <h1 className="display-5 fw-bold text-dark">
              Customize & Book Amazing Holiday Packages
            </h1>
            <p className="lead text-dark">
              650+ Travel Agents serving 65+ Destinations worldwide
            </p>
            <div className="row g-2 mt-4">
              <Dropdown
                label="Destination"
                options={destinations}
                icon={faMapMarkerAlt}
                defaultText="Type a Destination"
              />
              <Dropdown
                label="Duration"
                options={durations}
                icon={faClock}
                defaultText="Select Duration"
              />
              <Dropdown
                label="Month"
                options={bestMonths}
                icon={faCalendarAlt}
                defaultText="Select Month"
              />
              <div className="col-12 col-md-3">
                <button
                  className="btn h-100 fw-bold w-100"
                  style={{ backgroundColor: "#ef156c", color: "white" }}
                >
                  <FontAwesomeIcon icon={faSearch} className="me-2" /> Explore
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-3 d-none d-lg-block">
            <img
              src={rightImage}
              alt="Right Illustration"
              className="img-fluid right-image"
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
          Real travelers. Real stories. Real opinions to help you make the right
          choice.
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
                    {review.name.charAt(0).toUpperCase()} {/* First letter of name */}
                  </div>
                  <div>
                    <h5 className="mb-0">{review.name}</h5>
                    <small className="text-muted">
                      {review.bookingDetails.username}
                    </small>
                  </div>
                </div>
                {/* Date */}
                <div className="text-muted small">
                  {new Date(review.bookingDetails.date).toLocaleDateString()}{" "}
                  {/* Format Date */}
                </div>
              </div>
              {/* Rating */}
              <div className="rating mb-3 text-muted">
                {renderStars(review.tourRating)} {/* Dynamic Rating */}
              </div>
              {/* Comments */}
              <p className="fw-bold mb-2">{review.comments}</p>
              {/* Package Details */}
              <p>
                <strong>Package:</strong>{" "}
                {review.packageDetails.name}
              </p>
              {/* <p>
                <strong>Description:</strong>{" "}
                {review.packageDetails.packageDescription}
              </p> */}
              <p>
                <strong>Duration:</strong> {review.packageDetails.duration}
              </p>
              <small className="text-muted">
                <strong>Price:</strong> ₹{review.packageDetails.price}
              </small>
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
          <Honeymoon_category  honeymoonData={honeymoonData} />
          <Wildlife_category  wildlifeData={wildlifeData} />
          <Hillstations_category hillStationsData={hillStationsData} />
          <Pilgrimage_category pilgrimageData={pilgrimageData} />
          <Heritage_category heritageData={heritageData} />
          <Beach_category beachData={beachData} />
          <div style={{height:'65vh'}}> 
            <MapComponent locationDetails={locations}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
