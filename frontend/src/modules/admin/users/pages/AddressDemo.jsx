import React, { useEffect, useReducer, useCallback } from "react";
import axios from "axios";
import AddressTable from "./table/AddressTable";

// Action types
const SET_COUNTRIES = "SET_COUNTRIES";
const SET_STATES = "SET_STATES";
const SET_CITIES = "SET_CITIES";
const SET_FORM_DATA = "SET_FORM_DATA";

// Reducer function to handle state updates
const addressReducer = (state, action) => {
  switch (action.type) {
    case SET_COUNTRIES:
      return { ...state, countries: action.payload };
    case SET_STATES:
      return { ...state, states: action.payload, cities: [] }; // Reset cities on state change
    case SET_CITIES:
      return { ...state, cities: action.payload };
    case SET_FORM_DATA:
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
};

const AddressDemo = () => {
  const [state, dispatch] = useReducer(addressReducer, {
    countries: [],
    states: [],
    cities: [],
    formData: {
      country: null,
      state: null,
      city: null,
      description: "",
      startingPrice: "",
      coordinates: { latitude: "", longitude: "" },
      images: [],
    },
  });

  const API_KEY = "UVp5OThWTkpGSXBjNzNnNXVuODJuOUVydnp3RWlFRmtFVlRsSTNTdA==";

  // Fetch countries on initial render
  useEffect(() => {
    axios
      .get("https://api.countrystatecity.in/v1/countries", {
        headers: { "X-CSCAPI-KEY": API_KEY },
      })
      .then((response) => {
        dispatch({ type: SET_COUNTRIES, payload: response.data });
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  // Handle country change
  const handleCountryChange = useCallback(
    async (countryIso2) => {
      const selectedCountry = state.countries.find(
        (c) => c.iso2 === countryIso2
      );
      dispatch({
        type: SET_FORM_DATA,
        payload: { country: selectedCountry, state: null, city: null },
      });

      if (selectedCountry?.iso2) {
        try {
          const response = await axios.get(
            `https://api.countrystatecity.in/v1/countries/${selectedCountry.iso2}/states`,
            {
              headers: { "X-CSCAPI-KEY": API_KEY },
            }
          );
          dispatch({ type: SET_STATES, payload: response.data });
        } catch (error) {
          console.error("Error fetching states:", error);
        }
      }
    },
    [state.countries]
  );

  // Handle state change
  const handleStateChange = useCallback(
    async (stateIso2) => {
      const selectedState = state.states.find((s) => s.iso2 === stateIso2);
      dispatch({
        type: SET_FORM_DATA,
        payload: { state: selectedState, city: null },
      });

      if (selectedState?.iso2 && state.formData.country?.iso2) {
        try {
          const response = await axios.get(
            `https://api.countrystatecity.in/v1/countries/${state.formData.country.iso2}/states/${selectedState.iso2}/cities`,
            { headers: { "X-CSCAPI-KEY": API_KEY } }
          );
          dispatch({ type: SET_CITIES, payload: response.data });
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      }
    },
    [state.states, state.formData.country]
  );

  // Handle city change
  const handleCityChange = (cityId) => {
    console.log("Selected city ID:", cityId); // Log the cityId passed to the function

    if (state.cities.length > 0) {
      console.log("Cities array:", state.cities); // Log the cities array
    } else {
      console.log("Cities array is empty or not initialized correctly.");
    }

    // Attempt to find the selected city
    const selectedCity = state.cities.find((c) => {
      console.log("Comparing cityId:", cityId, "with c.id:", c.id);
      return Number(c.id) === Number(cityId); // Make sure both sides of the comparison are of the same type
    });

    console.log("Selected city:", selectedCity); // Log the selected city

    if (selectedCity) {
      const { latitude, longitude } = selectedCity; // Assuming these properties exist in the city object

      // Dispatch action to update the form data, including latitude and longitude
      dispatch({
        type: SET_FORM_DATA,
        payload: {
          city: selectedCity,
          coordinates: { latitude, longitude },
        },
      });
      //   dispatch({ type: SET_FORM_DATA, payload: { city: selectedCity } });
    } else {
      console.log("City with ID " + cityId + " not found in the cities array.");
    }
  };

  // Handle form data change (for description, price, coordinates, etc.)
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: SET_FORM_DATA, payload: { [name]: value } });
  };

  // Handle file upload for images
  const handleImageUpload = (e) => {
    dispatch({ type: SET_FORM_DATA, payload: { images: [...e.target.files] } });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Log the current state data for debugging
    console.log(state.formData);
  
    // Prepare form data by destructuring the formData state
    const formData = { ...state.formData };
  
    // Extract the cityId from the selected city object, if needed
    const cityId = formData.city?.id;
  
    // Clean up the formData by removing the full city object
    delete formData.city;
  
    // Prepare the coordinates array with latitude and longitude
    const coordinates = formData.coordinates;
    const formattedCoordinates = [
      parseFloat(coordinates.latitude || 0), // Latitude as a number
      parseFloat(coordinates.longitude || 0), // Longitude as a number
    ];
  
    // Prepare the final request data
    const requestData = {
      ...formData,
      cityId: cityId, // Only the cityId will be sent (not the full city object)
      coordinates: formattedCoordinates, // Send the coordinates array as numbers
      images: formData.images, // Assuming images are already in the correct format for the API
    };
  
    // Create a FormData instance for file uploads
    const finalFormData = new FormData();
  
    // Append each field to the FormData
    Object.keys(requestData).forEach((key) => {
      const value = requestData[key];
  
      // If the field is an array (like images), append each item
      if (Array.isArray(value)) {
        value.forEach((item) => {
          // Check if it's an image URL or a file (if it's a file, append it as a file)
          if (item instanceof File) {
            finalFormData.append(key, item);
          } else {
            finalFormData.append(key, item); // Append as string if it's not a file
          }
        });
      } else {
        finalFormData.append(key, value); // Append single field (e.g., string, number)
      }
    });
  
    // Now append the coordinates directly (as an array) to FormData
    finalFormData.append(JSON.stringify(formattedCoordinates)); // Latitude
    e
  
    try {
      // Submit the form data as FormData for handling file uploads
      const response = await axios.post("http://localhost:3000/api/address/create-address", finalFormData, {
        headers: {
          "Content-Type": "multipart/form-data", // Make sure the server knows to expect FormData
        },
      });
      console.log("Form submitted successfully:", response.data);
      // Handle success (e.g., navigate, show a success message, etc.)
    } catch (error) {
      console.error("Error submitting form:", error);
      // Handle error (e.g., show error message)
    }
  };
  

  // Handle editing an address
  const handleEdit = (address) => {
    const {
      countryName,
      stateName,
      cityName,
      description,
      startingPrice,
      coordinates,
      images,
      id,
    } = address;

    // Find and set the selected country
    const selectedCountry = state.countries.find(
      (country) => country.name === countryName
    );
    dispatch({ type: SET_FORM_DATA, payload: { country: selectedCountry } });

    // Call handleCountryChange to update states
    handleCountryChange(selectedCountry?.iso2);

    // Find and set the selected state
    const selectedState = state.states.find(
      (state) => state.name === stateName
    );
    dispatch({ type: SET_FORM_DATA, payload: { state: selectedState } });

    // Call handleStateChange to update cities
    handleStateChange(selectedState?.iso2);

    // Find and set the selected city
    const selectedCity = state.cities.find((city) => city.name === cityName);
    dispatch({ type: SET_FORM_DATA, payload: { city: selectedCity } });

    // Set other form fields
    dispatch({
      type: SET_FORM_DATA,
      payload: {
        description,
        startingPrice,
        coordinates: { latitude: coordinates[0], longitude: coordinates[1] },
        images,
        addressId: id,
      },
    });
  };

  // Handle delete
  const handleDelete = (addressId) => {
    // Handle deletion logic
    console.log("Deleting address with ID:", addressId);
    // Update state or call API to delete
  };

  return (
    <div className="container mt-5">
      {/* <h2 className="text-center mb-4">Cascading Dropdowns with Full Values</h2> */}
      <form onSubmit={handleSubmit}>
        {/* Country Dropdown */}
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Country:
          </label>
          <select
            id="country"
            className="form-select"
            value={state.formData.country?.iso2 || ""}
            onChange={(e) => handleCountryChange(e.target.value)}
          >
            <option value="">Select Country</option>
            {state.countries.map((country) => (
              <option key={country.iso2} value={country.iso2}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        {state.states.length > 0 && (
          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State:
            </label>
            <select
              id="state"
              className="form-select"
              value={state.formData.state?.iso2 || ""}
              onChange={(e) => handleStateChange(e.target.value)}
            >
              <option value="">Select State</option>
              {state.states.map((stateItem) => (
                <option key={stateItem.iso2} value={stateItem.iso2}>
                  {stateItem.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* City Dropdown */}
        {state.cities.length > 0 && (
          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City:
            </label>
            <select
              id="city"
              className="form-select"
              value={state.formData.city?.id || ""}
              onChange={(e) => handleCityChange(e.target.value)}
            >
              <option value="">Select City</option>
              {state.cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      
        {/* Latitude and Longitude */}
        <div className="mb-3">
          <label htmlFor="latitude" className="form-label">
            Latitude:
          </label>
          <input
            type="text"
            id="latitude"
            name="latitude"
            className="form-control mb-2"
            value={state.formData.coordinates.latitude}
            onChange={handleFormDataChange}
          />
          <label htmlFor="longitude" className="form-label">
            Longitude:
          </label>
          <input
            type="text"
            id="longitude"
            name="longitude"
            className="form-control"
            value={state.formData.coordinates.longitude}
            onChange={handleFormDataChange}
          />
        </div>
      
      </form>
    
    </div>
  );
};

export default AddressDemo;
