import axios from "axios";

// Define API endpoints from environment variables for USER
const fetchApi = import.meta.env.VITE_FETCH_USERS;
const createApi = import.meta.env.VITE_CREATE_USER;
const fetchApiById = import.meta.env.VITE_FETCH_USER_BY_ID;
const updateApi = import.meta.env.VITE_UPDATE_USER;
const deleteApi = import.meta.env.VITE_DELETE_USER;
// Define API endpoints from environment variables for PLACES
const fetchAllPlaces = import.meta.env.VITE_FETCH_ALL_PLACES;
const fetchSubPlacesForCity = import.meta.env.VITE_FETCH_SUB_PLACES_FOR_CITY;
const fetchAllPopularPlaces = import.meta.env.VITE_FETCH_ALL_POPULAR_PLACES;
const createPlaces = import.meta.env.VITE_CREATE_PLACE;
const updatePlaces = import.meta.env.VITE_UPDATE_PLACE;
const deletePlaces = import.meta.env.VITE_DELETE_PLACE;
const fetchPlacesImage = import.meta.env.VITE_PLACE_IMAGE;

// API functions for USER MANAGEMENT
export const fetchUsersData = (page, search, sort) =>
  axios.get(`${fetchApi}?page=${page}&search=${search}&sort=${sort}`);

export const fetchUserByIdData = (id) => axios.get(`${fetchApiById}/${id}`);

export const createUserData = (data) => axios.post(createApi, data);

export const updateUserData = (id, data) => axios.put(`${updateApi}/${id}`, data);

export const deleteUserData = (id) => axios.put(`${deleteApi}/${id}`);

// API functions for PLACE MANAGEMENT

export const fetchPlacesData = (stateName,cityName,page, search, sort) =>
  axios.get(`${fetchAllPlaces}?stateName=${stateName}&cityName=${cityName}&page=${page}&search=${search}&sort=${sort}`);

export const fetchSubPlacesForCityData = (name) => axios.get(`${fetchSubPlacesForCity}?name=${name}`);

export const fetchAllPopularPlacesData = () => axios.get(`${fetchAllPopularPlaces}`);

export const createPlaceData = (data) => axios.post(createPlaces, data);

export const updatePlaceData = (placeId, data) => axios.put(`${updatePlaces}/${placeId}`, data);

export const deletePlaceData = (placeId) => axios.delete(`${deletePlaces}/${placeId}`);

export const getPlaceImageData = (placeName,fileName) => axios.get(`${fetchPlacesImage}?placeName=${placeName}&fileName=${fileName}`);
