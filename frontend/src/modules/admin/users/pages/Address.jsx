import React, { useReducer, useState } from "react";
import AddressTable from "./table/AddressTable";
import AddressDemo from "./AddressDemo";
import axios from "axios";
import {deleteAddress,updateAddress,createAddress} from "../../services/ApiService";
// Action types
const SET_FIELD_VALUE = "SET_FIELD_VALUE";

// Reducer function to handle state updates
const addressReducer = (state, action) => {
  switch (action.type) {
    case SET_FIELD_VALUE:
      return { ...state, [action.field]: action.payload };
    default:
      return state;
  }
};

const Address = () => {
  const [state, dispatch] = useReducer(addressReducer, {
    country: "",
    state: "",
    city: "",
    description: "",
    startingPrice: "",
    latitude: "",
    longitude: "",
    images: [],
    addressId: null,
  });

  // Handle form data change
  const handleFormDataChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: SET_FIELD_VALUE, field: name, payload: value });
  };

  // Handle file upload for images
  const handleImageUpload = (e) => {
    dispatch({
      type: SET_FIELD_VALUE,
      field: "images",
      payload: [...e.target.files],
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      country: state.country,
      state: state.state,
      city: state.city,
      description: state.description,
      startingPrice: state.startingPrice,
      coordinates: [parseFloat(state.latitude), parseFloat(state.longitude)],
      images: state.images,
    };

    // Prepare FormData for file uploads
    const finalFormData = new FormData();
    Object.keys(requestData).forEach((key) => {
      const value = requestData[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            finalFormData.append(key, item);
          } else {
            finalFormData.append(key, item);
          }
        });
      } else {
        finalFormData.append(key, value);
      }
    });

    try {
      let response;
      if (state.addressId) {
        response = await updateAddress(state.addressId,finalFormData);
      } else {
        response = await createAddress(finalFormData);
      }
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  // Handle editing an address
  const handleEdit = (address) => {
    const {
      cityName,
      stateName,
      countryName,
      description,
      startingPrice,
      coordinates,
      images,
      id,
    } = address;

    // Set values directly from the selected address
    dispatch({ type: SET_FIELD_VALUE, field: "country", payload: countryName });
    dispatch({ type: SET_FIELD_VALUE, field: "state", payload: stateName });
    dispatch({ type: SET_FIELD_VALUE, field: "city", payload: cityName });
    dispatch({
      type: SET_FIELD_VALUE,
      field: "description",
      payload: description,
    });
    dispatch({
      type: SET_FIELD_VALUE,
      field: "startingPrice",
      payload: startingPrice,
    });
    dispatch({
      type: SET_FIELD_VALUE,
      field: "latitude",
      payload: coordinates[0],
    });
    dispatch({
      type: SET_FIELD_VALUE,
      field: "longitude",
      payload: coordinates[1],
    });
    dispatch({ type: SET_FIELD_VALUE, field: "images", payload: images });
    dispatch({ type: SET_FIELD_VALUE, field: "addressId", payload: id });
  };

  // Handle delete
  const handleDelete = async (addressId) => {
    try {
      console.log("Deleting address with ID:", addressId);
  
      // Call the delete API to remove the address
      const response = await deleteAddress(addressId.id);
      // Handle successful deletion
      console.log("Address deleted successfully:", response.data);
  
      // You can also update the state or trigger a refresh to remove the deleted address from the UI
      // For example, you can update the addresses list:
      // setAddresses((prevAddresses) => prevAddresses.filter(address => address.id !== addressId));
  
    } catch (error) {
      console.error("Error deleting address:", error);
      // Optionally, handle error (e.g., show error message to the user)
    }
  };
  
  const handleUpdate = async (e) => {
    e.preventDefault();

    const requestData = {
      country: state.country,
      state: state.state,
      city: state.city,
      description: state.description,
      startingPrice: state.startingPrice,
      coordinates: [parseFloat(state.latitude), parseFloat(state.longitude)],
      images: state.images,
    };

    // Prepare FormData for file uploads
    const finalFormData = new FormData();
    Object.keys(requestData).forEach((key) => {
      const value = requestData[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item instanceof File) {
            finalFormData.append(key, item);
          } else {
            finalFormData.append(key, item);
          }
        });
      } else {
        finalFormData.append(key, value);
      }
    });

    try {
      const response = await axios.put(
        `http://localhost:3000/api/address/update-address/${state.addressId}`,
        finalFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log("Form updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating form:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">
        {state.addressId ? "Edit Address" : "Create Address"}
      </h2>
      <div className="d-flex gap-5">
        <form
          onSubmit={state.addressId ? handleUpdate : handleSubmit}
          className="flex-grow-1"
        >
          {/* Form Fields */}
          <div className="mb-3">
            <label htmlFor="country" className="form-label">
              Country:
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="form-control"
              value={state.country}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="state" className="form-label">
              State:
            </label>
            <input
              type="text"
              id="state"
              name="state"
              className="form-control"
              value={state.state}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">
              City:
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="form-control"
              value={state.city}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description:
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={state.description}
              onChange={handleFormDataChange}
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="startingPrice" className="form-label">
              Starting Price:
            </label>
            <input
              type="number"
              id="startingPrice"
              name="startingPrice"
              className="form-control"
              value={state.startingPrice}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="latitude" className="form-label">
              Latitude:
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              className="form-control mb-2"
              value={state.latitude}
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
              value={state.longitude}
              onChange={handleFormDataChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="images" className="form-label">
              Upload Images:
            </label>
            <input
              type="file"
              id="images"
              className="form-control"
              multiple
              onChange={handleImageUpload}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">
            {state.addressId ? "Update" : "Submit"}
          </button>
        </form>

        <div className="d-flex flex-grow-1">
          <AddressDemo />
        </div>
      </div>

      <hr />
      <div className="mt-3">
        <AddressTable onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
};

export default Address;
