// import axios from "axios";

// // Define API endpoints from environment variables for USER
// const fetchApi = import.meta.env.VITE_FETCH_USERS;
// const createApi = import.meta.env.VITE_CREATE_USER;
// const fetchApiById = import.meta.env.VITE_FETCH_USER_BY_ID;
// const updateApi = import.meta.env.VITE_UPDATE_USER;
// const deleteApi = import.meta.env.VITE_DELETE_USER;
// // Define API endpoints from environment variables for PLACES
// const fetchAllPlaces = import.meta.env.VITE_FETCH_ALL_PLACES;
// const fetchSubPlacesForCity = import.meta.env.VITE_FETCH_SUB_PLACES_FOR_CITY;
// const fetchAllPopularPlaces = import.meta.env.VITE_FETCH_ALL_POPULAR_PLACES;
// const createPlaces = import.meta.env.VITE_CREATE_PLACE;
// const updatePlaces = import.meta.env.VITE_UPDATE_PLACE;
// const deletePlaces = import.meta.env.VITE_DELETE_PLACE;
// const fetchPlacesImage = import.meta.env.VITE_PLACE_IMAGE;

// // API functions for USER MANAGEMENT
// export const fetchUsersData = (page, search, sort) =>
//   axios.get(`${fetchApi}?page=${page}&search=${search}&sort=${sort}`);

// export const fetchUserByIdData = (id) => axios.get(`${fetchApiById}/${id}`);

// export const createUserData = (data) => axios.post(createApi, data);

// export const updateUserData = (id, data) => axios.put(`${updateApi}/${id}`, data);

// export const deleteUserData = (id) => axios.put(`${deleteApi}/${id}`);

// // API functions for PLACE MANAGEMENT

// export const fetchPlacesData = (stateName,cityName,page, search, sort) =>
//   axios.get(`${fetchAllPlaces}?stateName=${stateName}&cityName=${cityName}&page=${page}&search=${search}&sort=${sort}`);

// export const fetchSubPlacesForCityData = (name) => axios.get(`${fetchSubPlacesForCity}?name=${name}`);

// export const fetchAllPopularPlacesData = () => axios.get(`${fetchAllPopularPlaces}`);

// export const createPlaceData = (data) => axios.post(createPlaces, data);

// export const updatePlaceData = (placeId, data) => axios.put(`${updatePlaces}/${placeId}`, data);

// export const deletePlaceData = (placeId) => axios.delete(`${deletePlaces}/${placeId}`);

// export const getPlaceImageData = (placeName,fileName) => axios.get(`${fetchPlacesImage}?placeName=${placeName}&fileName=${fileName}`);

import axios from "axios";

// Base API URL
const BASE_URL = import.meta.env.VITE_BASE_URL;
const formatUrl = (path) =>
  path.startsWith("http") ? path : `${BASE_URL}${path}`;

// Define API endpoints for USER MANAGEMENT
const FETCH_USERS_URL = import.meta.env.VITE_FETCH_USERS.startsWith("http")
  ? import.meta.env.VITE_FETCH_USERS
  : `${BASE_URL}${import.meta.env.VITE_FETCH_USERS}`;

const FETCH_USER_BY_ID_URL = import.meta.env.VITE_FETCH_USER_BY_ID.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_USER_BY_ID
  : `${BASE_URL}${import.meta.env.VITE_FETCH_USER_BY_ID}`;

const CREATE_USER_URL = import.meta.env.VITE_CREATE_USER.startsWith("http")
  ? import.meta.env.VITE_CREATE_USER
  : `${BASE_URL}${import.meta.env.VITE_CREATE_USER}`;

const UPDATE_USER_URL = import.meta.env.VITE_UPDATE_USER.startsWith("http")
  ? import.meta.env.VITE_UPDATE_USER
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_USER}`;

const DELETE_USER_URL = import.meta.env.VITE_DELETE_USER.startsWith("http")
  ? import.meta.env.VITE_DELETE_USER
  : `${BASE_URL}${import.meta.env.VITE_DELETE_USER}`;

// Define API endpoints for PLACE MANAGEMENT
const FETCH_ALL_PLACES_URL = import.meta.env.VITE_FETCH_ALL_PLACES.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_PLACES
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_PLACES}`;

const FETCH_SUB_PLACES_URL = import.meta.env.VITE_FETCH_SUB_PLACES_FOR_CITY.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_SUB_PLACES_FOR_CITY
  : `${BASE_URL}${import.meta.env.VITE_FETCH_SUB_PLACES_FOR_CITY}`;

const FETCH_ALL_POPULAR_PLACES_URL = import.meta.env.VITE_FETCH_ALL_POPULAR_PLACES.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_POPULAR_PLACES
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_POPULAR_PLACES}`;

const CREATE_PLACE_URL = import.meta.env.VITE_CREATE_PLACE.startsWith("http")
  ? import.meta.env.VITE_CREATE_PLACE
  : `${BASE_URL}${import.meta.env.VITE_CREATE_PLACE}`;

const UPDATE_PLACE_URL = import.meta.env.VITE_UPDATE_PLACE.startsWith("http")
  ? import.meta.env.VITE_UPDATE_PLACE
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_PLACE}`;

const DELETE_PLACE_URL = import.meta.env.VITE_DELETE_PLACE.startsWith("http")
  ? import.meta.env.VITE_DELETE_PLACE
  : `${BASE_URL}${import.meta.env.VITE_DELETE_PLACE}`;

const FETCH_PLACE_IMAGE_URL = import.meta.env.VITE_PLACE_IMAGE.startsWith(
  "http"
)
  ? import.meta.env.VITE_PLACE_IMAGE
  : `${BASE_URL}${import.meta.env.VITE_PLACE_IMAGE}`;
// Define API endpoints for TOUR PLAN MANAGEMENT

const VITE_FETCH_ALL_ADDRESS_FOR_PLACES = import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_PLACES.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_PLACES
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_PLACES}`;
 // Base URL
const FETCH_TOUR_PLAN_URL = `${BASE_URL}${import.meta.env.VITE_FETCH_TOUR_PLAN_BY_TOURID}`; // Combine with the path


const VITE_FETCH_ALL_THEMES_FOR_TOUR_PLANS = import.meta.env.VITE_FETCH_ALL_THEMES_FOR_TOUR_PLANS.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_THEMES_FOR_TOUR_PLANS
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_THEMES_FOR_TOUR_PLANS}`;

const VITE_FETCH_ALL_CITIES_FOR_TOUR_PLANS = import.meta.env.VITE_FETCH_ALL_CITIES_FOR_TOUR_PLANS.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_CITIES_FOR_TOUR_PLANS
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_CITIES_FOR_TOUR_PLANS}`;

const VITE_FETCH_SUB_CITIES_BY_CITYNAME = import.meta.env.VITE_FETCH_SUB_CITIES_BY_CITYNAME.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_SUB_CITIES_BY_CITYNAME
  : `${BASE_URL}${import.meta.env.VITE_FETCH_SUB_CITIES_BY_CITYNAME}`;

const VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH = import.meta.env.VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH}`;

const VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH_BY_CITY = import.meta.env.VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH_BY_CITY.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH_BY_CITY
  : `${BASE_URL}${
      import.meta.env.VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH_BY_CITY
    }`;

const VITE_CREATE_TOUR_PLAN = import.meta.env.VITE_CREATE_TOUR_PLAN.startsWith(
  "http"
)
  ? import.meta.env.VITE_CREATE_TOUR_PLAN
  : `${BASE_URL}${import.meta.env.VITE_CREATE_TOUR_PLAN}`;

const VITE_UPDATE_TOUR_PLAN = import.meta.env.VITE_UPDATE_TOUR_PLAN.startsWith(
  "http"
)
  ? import.meta.env.VITE_UPDATE_TOUR_PLAN
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_TOUR_PLAN}`;

const VITE_DELETE_TOUR_PLAN = import.meta.env.VITE_DELETE_TOUR_PLAN.startsWith(
  "http"
)
  ? import.meta.env.VITE_DELETE_TOUR_PLAN
  : `${BASE_URL}${import.meta.env.VITE_DELETE_TOUR_PLAN}`;

const VITE_GET_IMAGE_FOR_TOUR_PLAN = import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN.startsWith(
  "http"
)
  ? import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN
  : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN}`;

// support management
const FETCH_ALL_QUOTES_FOR_ADMIN_PAGE_URL = formatUrl(
  import.meta.env.VITE_FETCH_ALL_QUOTE_FOR_ADMIN_PAGE
);
const CREATE_QUOTE_URL = formatUrl(import.meta.env.VITE_CREATE_QUOTE);
const UPDATE_QUOTE_URL = formatUrl(import.meta.env.VITE_UPDATE_QUOTE);
const UPDATE_QUOTE_STATUS_URL = formatUrl(
  import.meta.env.VITE_UPDATE_QUOTE_STATUS
);
const DELETE_QUOTE_URL = formatUrl(import.meta.env.VITE_DELETE_QUOTE);

//Settings management
const FETCH_USER_BY_ID_SETTINGS_URL = import.meta.env.VITE_FETCH_USER_BY_ID.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_USER_BY_ID
  : `${BASE_URL}${import.meta.env.VITE_FETCH_USER_BY_ID}`;

const UPDATE_USER_BY_ID_URL = import.meta.env.VITE_UPDATE_USER_BY_ID.startsWith(
  "http"
)
  ? import.meta.env.VITE_UPDATE_USER_BY_ID
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_USER_BY_ID}`;

//Feedback Management
const FETCH_ALL_REVIEWS_FOR_ADMIN_URL = import.meta.env.VITE_FETCH_ALL_REVIEWS_FOR_ADMIN.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_REVIEWS_FOR_ADMIN
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_REVIEWS_FOR_ADMIN}`;

//Blog Management
const FETCH_ALL_BLOGS_URL = import.meta.env.VITE_FETCH_ALL_BLOGS.startsWith(
  "http"
)
  ? import.meta.env.VITE_FETCH_ALL_BLOGS
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_BLOGS}`;

  const FETCH_BLOG_BY_TITLE_URL = import.meta.env.VITE_FETCH_BLOG_BY_TITLE.startsWith("http")
  ? import.meta.env.VITE_FETCH_BLOG_BY_TITLE
  : `${BASE_URL}${import.meta.env.VITE_FETCH_BLOG_BY_TITLE}`;

const CREATE_BLOG_URL = import.meta.env.VITE_CREATE_BLOG.startsWith("http")
  ? import.meta.env.VITE_CREATE_BLOG
  : `${BASE_URL}${import.meta.env.VITE_CREATE_BLOG}`;

const UPDATE_BLOG_URL = import.meta.env.VITE_UPDATE_BLOG.startsWith("http")
  ? import.meta.env.VITE_UPDATE_BLOG
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_BLOG}`;

const DELETE_BLOG_URL = import.meta.env.VITE_DELETE_BLOG.startsWith("http")
  ? import.meta.env.VITE_DELETE_BLOG
  : `${BASE_URL}${import.meta.env.VITE_DELETE_BLOG}`;

  const GET_IMAGE_FOR_BLOG_URL = import.meta.env.VITE_GET_IMAGE_FOR_BLOG.startsWith("http")
  ? import.meta.env.VITE_GET_IMAGE_FOR_BLOG
  : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_BLOG}`;

// Address Mangement
const FETCH_ALL_ADDRESS_FOR_ADMIN_URL = import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_ADMIN.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_ADMIN
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_ADMIN}`;

const CREATE_ADDRESS_URL = import.meta.env.VITE_CREATE_ADDRESS.startsWith("http")
  ? import.meta.env.VITE_CREATE_ADDRESS
  : `${BASE_URL}${import.meta.env.VITE_CREATE_ADDRESS}`;

const UPDATE_ADDRESS_URL = import.meta.env.VITE_UPDATE_ADDRESS.startsWith("http")
  ? import.meta.env.VITE_UPDATE_ADDRESS
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_ADDRESS}`;

const DELETE_ADDRESS_URL = import.meta.env.VITE_DELETE_ADDRESS.startsWith("http")
  ? import.meta.env.VITE_DELETE_ADDRESS
  : `${BASE_URL}${import.meta.env.VITE_DELETE_ADDRESS}`;

const GET_IMAGE_FOR_ADDRESS_URL = import.meta.env.VITE_GET_IMAGE_FOR_ADDRESS.startsWith("http")
  ? import.meta.env.VITE_GET_IMAGE_FOR_ADDRESS
  : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_ADDRESS}`;

// Booking Management
const FETCH_ALL_BOOKING_FOR_BOOKING_URL = import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING}`;

const FETCH_ALL_TOUR_PLAN_FOR_SEARCH_BY_CITY_URL = import.meta.env.VITE_FETCH_ALL_TOUR_PLAN_FOR_SEARCH_BY_CITY.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_TOUR_PLAN_FOR_SEARCH_BY_CITY
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_TOUR_PLAN_FOR_SEARCH_BY_CITY}`;

const FETCH_ALL_ADDRESS_FOR_PLACES_URL = import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_PLACES.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_PLACES
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_ADDRESS_FOR_PLACES}`;

const CREATE_BOOKING_URL = import.meta.env.VITE_CREATE_BOOKING.startsWith("http")
  ? import.meta.env.VITE_CREATE_BOOKING
  : `${BASE_URL}${import.meta.env.VITE_CREATE_BOOKING}`;

const UPDATE_BOOKING_STATUS_URL = import.meta.env.VITE_UPDATE_BOOKING_STATUS.startsWith("http")
  ? import.meta.env.VITE_UPDATE_BOOKING_STATUS
  : `${BASE_URL}${import.meta.env.VITE_UPDATE_BOOKING_STATUS}`;

// Dashboard Management
const FETCH_ALL_BOOKING_FOR_BOOKING_DASHBOARD_URL = import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_DASHBOARD.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_DASHBOARD
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_DASHBOARD}`;

  const FETCH_ALL_BOOKING_FOR_USERID_DASHBOARD_URL = import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_BY_USERID_DASHBOARD.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_BY_USERID_DASHBOARD
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_BY_USERID_DASHBOARD}`;
//Upcoming Trips Management
const FETCH_ALL_BOOKING_FOR_UPCOMING_TRIPS_URL = import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_UPCOMING_TRIPS.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_UPCOMING_TRIPS
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_BOOKING_FOR_BOOKING_UPCOMING_TRIPS}`;

//BYUSERID
const FETCH_ALL_BOOKING_BY_USERID_URL = import.meta.env.VITE_FETCH_ALL_BOOKING_BY_USERID.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_BOOKING_BY_USERID
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_BOOKING_BY_USERID}`;


  //  Header component
  const FETCH_ALL_ADDRESS_TOUR_TYPE_URL = import.meta.env.VITE_FETCH_ALL_ADDRESS_TOUR_TYPE.startsWith("http")
  ? import.meta.env.VITE_FETCH_ALL_ADDRESS_TOUR_TYPE
  : `${BASE_URL}${import.meta.env.VITE_FETCH_ALL_ADDRESS_TOUR_TYPE}`;

// Map Component
const MAP_DATA_ENDPOINT_URL = import.meta.env.VITE_MAP_DATA_ENDPOINT.startsWith("http")
  ? import.meta.env.VITE_MAP_DATA_ENDPOINT
  : `${BASE_URL}${import.meta.env.VITE_MAP_DATA_ENDPOINT}`;

// Payment Management
const CREATE_PAYMENT_URL = import.meta.env.VITE_CREATE_PAYMENT.startsWith("http")
  ? import.meta.env.VITE_CREATE_PAYMENT
  : `${BASE_URL}${import.meta.env.VITE_CREATE_PAYMENT}`;





// API functions for USER MANAGEMENT
export const fetchUsersData = (page, search, sort) =>
  axios.get(`${FETCH_USERS_URL}?page=${page}&search=${search}&sort=${sort}`);

export const fetchUserByIdData = (id) =>
  axios.get(`${FETCH_USER_BY_ID_URL}/${id}`);

export const createUserData = (data) => axios.post(CREATE_USER_URL, data);

export const updateUserData = (id, data) =>
  axios.put(`${UPDATE_USER_URL}/${id}`, data);

export const deleteUserData = (id) => axios.put(`${DELETE_USER_URL}/${id}`);

// API functions for TOUR PLANS MANAGEMENT
export const fetchAllAddressForPlaces = () =>
  axios.get(`${VITE_FETCH_ALL_ADDRESS_FOR_PLACES}`);

export const fetchTourPlanByTourId = (tourId) => 
  axios.get(`${FETCH_TOUR_PLAN_URL}/${tourId}`);

export const fetchAllThemesForTourPlans = () =>
  axios.get(`${VITE_FETCH_ALL_THEMES_FOR_TOUR_PLANS}`);

export const fetchAllCitesForTourPlans = () =>
  axios.get(VITE_FETCH_ALL_CITIES_FOR_TOUR_PLANS);

export const fetchSubCitiesByCityname = (cityName) =>
  axios.get(`${VITE_FETCH_SUB_CITIES_BY_CITYNAME}?cityName=${cityName}`);

export const fetchAllTourPlansSearchByCity = (
  selectedCity,
  searchTermValue,
  serchTerm,
  pagination
) =>
  axios.get(VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH_BY_CITY, {
    params: {
      cityName: selectedCity,
      title: searchTermValue || serchTerm, // Use the passed value or fallback to state
      page: pagination,
      limit: 10,
    },
  });

export const fetchAllTourPlansSearch = () =>
  axios.get(VITE_FETCH_ALL_TOUR_PLANS_FOR_SEARCH);

export const createTourPlan = (data) => axios.post(VITE_CREATE_TOUR_PLAN, data);

export const updateTourPlan = (tourPlanId, data) =>
  axios.put(`${VITE_UPDATE_TOUR_PLAN}/${tourPlanId}`, data);

export const deleteTourPlan = (tourPlanId) =>
  axios.delete(`${VITE_DELETE_TOUR_PLAN}/${tourPlanId}`);

export const fetchImageTourPlan = (tourCode, fileName) =>
  axios.get(
    `${VITE_GET_IMAGE_FOR_TOUR_PLAN}?tourCode=${tourCode}&fileName=${fileName}`
  );

// API functions for PLACE MANAGEMENT
export const fetchPlacesData = (stateName, cityName, page, search, sort) =>
  axios.get(
    `${FETCH_ALL_PLACES_URL}?stateName=${stateName}&cityName=${cityName}&page=${page}&search=${search}&sort=${sort}`
  );

export const fetchSubPlacesForCityData = (name) =>
  axios.get(`${FETCH_SUB_PLACES_URL}?name=${name}`);

export const fetchAllPopularPlacesData = () =>
  axios.get(FETCH_ALL_POPULAR_PLACES_URL);

export const createPlaceData = (data) => axios.post(CREATE_PLACE_URL, data);

export const updatePlaceData = (placeId, data) =>
  axios.put(`${UPDATE_PLACE_URL}/${placeId}`, data);

export const deletePlaceData = (placeId) =>
  axios.delete(`${DELETE_PLACE_URL}/${placeId}`);

export const getPlaceImageData = (placeName, fileName) =>
  axios.get(
    `${FETCH_PLACE_IMAGE_URL}?placeName=${placeName}&fileName=${fileName}`
  );

//API functions for Support
export const fetchAllQuotesForAdminPage = (
  page = 1,
  searchTerm = "",
  filter = ""
) => {
  return axios.get(FETCH_ALL_QUOTES_FOR_ADMIN_PAGE_URL, {
    params: {
      page,
      searchTerm,
      filter,
    },
  });
};

// Create a new quote
export const createQuote = (data) => axios.post(CREATE_QUOTE_URL, data);

// Update an existing quote
export const updateQuote = (id, data) =>
  axios.put(`${UPDATE_QUOTE_URL}/${id}`, data);

// Update the status of a quote
export const updateQuoteStatus = (id, status) =>
  axios.patch(`${UPDATE_QUOTE_STATUS_URL}/${id}`, status);

// Delete a quote
export const deleteQuote = (id) => axios.delete(`${DELETE_QUOTE_URL}/${id}`);

// API settings functions
export const fetchUserById = (id) =>
  axios.get(`${FETCH_USER_BY_ID_SETTINGS_URL}/${id}`);

// Update user by ID
export const updateUserById = (id, data) =>
  axios.put(`${UPDATE_USER_BY_ID_URL}/${id}`, data);

// API Feedback Functions
export const fetchAllReviewsForAdmin = (page = 1, limit = 10, filter = "") =>
  axios.get(FETCH_ALL_REVIEWS_FOR_ADMIN_URL, {
    params: {
      page: page,
      limit: limit,
      filter: filter,
    },
  });

  // API Blog Functions
  export const fetchAllBlogs = (page = 1, limit = 10, filter = "") =>
    axios.get(FETCH_ALL_BLOGS_URL, {
      params: {
        page: page,
        limit: limit,
        filter: filter,
      },
    });
  
  // Create a new blog
  export const createBlog = (data) => axios.post(CREATE_BLOG_URL, data);

  export const fetchBlogByTitle = (title) =>
    axios.get(`${FETCH_BLOG_BY_TITLE_URL}/${title}`);
  // Update a blog
  export const updateBlog = (id, data) =>
    axios.put(`${UPDATE_BLOG_URL}/${id}`, data);
  
  // Delete a blog
  export const deleteBlog = (id) => axios.delete(`${DELETE_BLOG_URL}/${id}`);

  export const getImageForBlog = (title,fileName) => {
    return axios.get(`${GET_IMAGE_FOR_BLOG_URL}?title=${title}&fileName=${fileName}`);
  };



  // API Address functions
 export  const fetchAllAddressesForAdmin = (country, state, city, currentPage = 1, limit = 10) =>
    axios.get(FETCH_ALL_ADDRESS_FOR_ADMIN_URL, {
      params: {
        country,
        state,
        city,
        page: currentPage,
        limit: limit,
      },
    });
  
  
  export const createAddress = (data) =>
    axios.post(CREATE_ADDRESS_URL, data);
  
  export const updateAddress = (id, data) =>
    axios.put(`${UPDATE_ADDRESS_URL}/${id}`, data);
  
  export const deleteAddress = (id) =>
    axios.delete(`${DELETE_ADDRESS_URL}/${id}`);
  


  // API Booking functions

  export const fetchAllBookingsForBooking = () =>
    axios.get(FETCH_ALL_BOOKING_FOR_BOOKING_URL);
  
  export const fetchAllBookingsByUserId = (userId) =>
    axios.get(`${FETCH_ALL_BOOKING_BY_USERID_URL}/${userId}`);

  export const fetchAllTourPlansForSearchByCity = (cityName) =>
    axios.get(`${FETCH_ALL_TOUR_PLAN_FOR_SEARCH_BY_CITY_URL}?cityName=${cityName}`);
  
  export const fetchAllAddressesForPlaces = () =>
    axios.get(FETCH_ALL_ADDRESS_FOR_PLACES_URL);
  
  export const createBooking = (bookingData) => axios.post(CREATE_BOOKING_URL, bookingData);
  
  export const updateBookingStatus = (id, status) =>
    axios.put(`${UPDATE_BOOKING_STATUS_URL}/${id}`, {status} );

  // API Dashboard functions
  export const fetchAllBookingsForDashboard = () =>
    axios.get(FETCH_ALL_BOOKING_FOR_BOOKING_DASHBOARD_URL);

  export const fetchAllBookingsByUserIdForDashboard = (userId, page = 1, limit = 10) =>
    axios.get(`${FETCH_ALL_BOOKING_FOR_USERID_DASHBOARD_URL}/${userId}?page=${page}&limit=${limit}`);

  //API Upcoming Trips

export const fetchAllBookingsForUpcomingTrips = () =>
  axios.get(FETCH_ALL_BOOKING_FOR_UPCOMING_TRIPS_URL);


// API Header component

export const fetchAllAddressesTourType = () =>
  axios.get(FETCH_ALL_ADDRESS_TOUR_TYPE_URL);

// API Map component

export const fetchMapData = () =>
  axios.get(MAP_DATA_ENDPOINT_URL);

// API Payment page
export const createPayment = (paymentData) =>
  axios.post(CREATE_PAYMENT_URL, paymentData);