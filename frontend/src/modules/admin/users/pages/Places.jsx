import React, { useState, useEffect } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import AlertMessage from "../../reusableComponents/AlertMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
import { Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
  fetchPlacesData,
  createPlaceData,
  updatePlaceData,
  deletePlaceData,
} from "../../services/ApiService";
import Step1 from "../pages/placeStepper/Step1";
import Step2 from "../pages/placeStepper/Step2";
import Step3 from "../pages/placeStepper/Step3";
import Step4 from "../pages/placeStepper/Step4";
import axios from "axios";
const steps = [
  "General Information",
  "Transport Information",
  "Network settings Information",
  "Weather Information",
];

const Places = () => {
  const { setComponentName } = useComponentName();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "city",
    state: "",
    parentPlace: "",
    subPlaces: [],
    images: [],
    bestTimetoVisit: "",
    idealTripDuration: "",
    transport: [
      {
        mode: "",
        from: "",
        end: "",
        transportDistance: "",
        duration: "",
      },
    ],
    networkSettings: {},
    weatherInfo: {},
    placeTitle: "",
    distance: "",
    placeLocation: "",
    travelTipes: "",
    transportOption: "",
    mustVisit: "",
    placePopular: "N",
    placeTop: "N",
    mostPopular: "N",
  });
  const [loading, setLoading] = useState(true);
  const [stateOptions, setStateOptions] = useState([]);
  const [parentPlaceOptions, setParentPlaceOptions] = useState([]);
  const [subPlaceOptions, setSubPlaceOptions] = useState([]);
  const [placeType, setPlaceType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [places, setPlaces] = useState([]);
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeId, setPlaceId] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [initialData, setInitialData] = useState(null);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const FETCH_PLACE_IMAGE_URL = import.meta.env.VITE_PLACE_IMAGE.startsWith(
    "http"
  )
    ? import.meta.env.VITE_PLACE_IMAGE
    : `${BASE_URL}${import.meta.env.VITE_PLACE_IMAGE}`;
  const constructImageURL = (imagePath) => {
    if (!imagePath) {
      console.warn("Image path is not provided.");
      return "";
    }

    // Normalize the path separators for cross-platform compatibility
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const parts = normalizedPath.split("/");

    let placeName = parts[0] || ""; // Extract the folder name as placeName
    let fileName = parts[1] || ""; // Extract the file name

    // Construct the URL
    return `${FETCH_PLACE_IMAGE_URL}?placeName=${encodeURIComponent(
      placeName
    )}&fileName=${encodeURIComponent(fileName)}`;
  };

  useEffect(() => {
    setComponentName("Places");
  }, [setComponentName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/address/get-all-addresses-for-places"
        );
        const cityResponse = await fetch(
          "http://localhost:3000/api/places/get-all-cities"
        );
        const data = await response.json();
        const cityData = await cityResponse.json();
        console.log(data);
        setStateOptions(data.states || []);
        setParentPlaceOptions(cityData.data || []);
        setSubPlaceOptions(cityData.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFormDataChange = (newData) => {
    setFormData((prev) => ({
      ...prev,
      ...newData,
    }));
  };
  async function urlToFile(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }

  // const handleSubmit = () => {
  //   const formattedData = {
  //     name: formData.name || "",
  //     description: formData.description || "",
  //     type: placeType,
  //     state: formData.state || "",
  //     parentPlace:
  //       placeType === "sub_place" ? formData.parentPlace || null : null,
  //     subPlaces: formData.subPlaces || [],
  //     images: formData.images || [],
  //     bestTimetoVisit: formData.bestTimetoVisit || "",
  //     idealTripDuration: formData.idealTripDuration || "",
  //     transport: [
  //       {
  //         mode: formData.mode,
  //         from: formData.from,
  //         end: formData.end,
  //         distance: formData.distance,
  //         duration: formData.duration,
  //       },
  //     ],
  //     networkSettings: {
  //       internetAvailability: formData.internetAvailability || "Moderate",
  //       stdCode: formData.stdCode || "+91",
  //       languageSpoken: formData.languageSpoken || [],
  //       majorFestivals: formData.majorFestivals || [],
  //       notesOrTips: formData.notesOrTips || "",
  //     },
  //     weatherInfo: {
  //       season:
  //         formData?.season?.map((season) => ({
  //           title: season.title,
  //           description: season.description,
  //         })) || [],
  //       nearestCity: formData.nearestCity || "",
  //       peakSeason: formData.peakSeason || "",
  //     },
  //     placeTitle: formData.placeTitle || "",
  //     placePopular: formData.placePopular || "N",
  //     placeTop: formData.placeTop || "N",
  //     mostPopular: formData.mostPopular || "N",
  //   };

  //   console.log(formattedData);
  // };
  const handleSubmit = async () => {
    const formDataPayload = new FormData();

    // Append individual fields to FormData
    formDataPayload.append("name", formData.name || "");
    formDataPayload.append("description", formData.description || "");
    formDataPayload.append("type", placeType);
    formDataPayload.append("state", formData.state || "");
    formDataPayload.append(
      "parentPlace",
      placeType === "sub_place" ? formData.parentPlace || null : null
    );

    // Convert blob URLs to files
    if (formData.images && formData.images.length > 0) {
      for (const image of formData.images) {
        if (typeof image === "string" && image.startsWith("blob:")) {
          // Convert blob URL to File
          const file = await urlToFile(image, "image.jpg"); // Replace with appropriate filename
          formDataPayload.append("images", file);
        } else {
          // Append the image directly if it's already a File object
          formDataPayload.append("images", image);
        }
      }
    }

    // Append transport array as objects
    const transportObject = {
      mode: formData.mode,
      from: formData.from,
      end: formData.end,
      transportDistance: formData.transportDistance,
      duration: formData.duration,
    };
    formDataPayload.append("transport", JSON.stringify([transportObject]));

    // Append nested objects (e.g., networkSettings)
    formDataPayload.append(
      "networkSettings",
      JSON.stringify({
        internetAvailability: formData.internetAvailability || "Moderate",
        stdCode: formData.stdCode || "+91",
        languageSpoken: formData.languageSpoken || [],
        majorFestivals: formData.majorFestivals || [],
        notesOrTips: formData.notesOrTips || "",
      })
    );

    // Append weatherInfo
    formDataPayload.append(
      "weatherInfo",
      JSON.stringify({
        season:
          formData?.season?.map((season) => ({
            title: season.title,
            description: season.description,
          })) || [],
        nearestCity: formData.nearestCity || "",
        peakSeason: formData.peakSeason || "",
      })
    );

    // Append other fields
    formDataPayload.append(
      "idealTripDuration",
      formData.idealTripDuration || ""
    );
    formDataPayload.append("distance", formData.distance || "");
    formDataPayload.append("transportOption", formData.transportOption || "");
    formDataPayload.append("placeLocation", formData.placeLocation || "");
    formDataPayload.append("travelTipes", formData.travelTipes || "");
    formDataPayload.append("placeTitle", formData.placeTitle || "");
    formDataPayload.append("placePopular", formData.placePopular || "N");
    formDataPayload.append("placeTop", formData.placeTop || "N");
    formDataPayload.append("mostPopular", formData.mostPopular || "N");
    formDataPayload.append("mustVisit", formData.mustVisit || "N");

    // Send the formDataPayload to the backend
    try {
      setStatus("");
      setMessage("");
      setShowAlert(false);
      const response = await createPlaceData(formDataPayload);
      console.log(response.data, "post");
      fetchFilteredPlaces();
      if (response && response.status === 201) {
        setStatus("success");
        setMessage("Place added successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to save user!");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      console.error("Error creating place:", error);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
    }
  };

  const fetchFilteredPlaces = async () => {
    setLoading(true);
    try {
      const response = await fetchPlacesData(
        selectedState,
        selectedCity,
        page,
        search,
        "name"
      );
      const data = response.data.data;
      console.log(data, "fetch");

      setPlaces(data || []);
      setTotalPlaces(response.data.total || 0);
      setTotalPages(Math.ceil(response.data.total / rowsPerPage));
      setRowsPerPage(response.data.limit);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredPlaces();
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchFilteredPlaces();
  }, [selectedState, selectedCity, search, page, rowsPerPage]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleShowModal = (place, type) => {
    setSelectedPlace({ ...place, type }); // Store selected place data and action type (view or delete)
    setShowModal(true);
  };

  const handleEdit = async (place) => {
    setInitialData(place);
    console.log(place, "place data");
    setPlaceId(place._id);
    const images = [];
    if (place.images && place.images.length > 0) {
      for (const imageUrl of place.images) {
        images.push(imageUrl);
      }
    }
    console.log(images, "copy");

    setFormData({
      name: place.name || "",
      description: place.description || "",
      type: place.type || "city", // Default to "city"
      state: place.state || "",
      parentPlace: place.parentPlace || "",
      subPlaces: place.subPlaces || [],
      images: images,
      bestTimetoVisit: place.bestTimetoVisit || "",
      idealTripDuration: place.idealTripDuration || "",
      transport: place.transport || [
        { mode: "", from: "", end: "", transportDistance: "", duration: "" },
      ],
      networkSettings: place.networkSettings || {},
      weatherInfo: place.weatherInfo || {},
      placeTitle: place.placeTitle || "",
      distance: place.distance || "",
      placeLocation: place.placeLocation || "",
      travelTipes: place.travelTipes || "",
      transportOption: place.transportOption || "",
      mustVisit: place.mustVisit || "",
      placePopular: place.placePopular || "N",
      placeTop: place.placeTop || "N",
      mostPopular: place.mostPopular || "N",
    });
    console.log(formData.images, "after");

    setPlaceType(place.type || "city");
  };
  const handleUpdate = async () => {
    console.log(formData);

    const formDataPayload = new FormData();
    const changes = {}; // To track changes

    // Helper function to append if a field has changed
    const appendIfChanged = (key, currentValue, initialValue) => {
      if (currentValue !== initialValue) {
        console.log(`Field ${key} has changed. Appending to FormData.`);
        formDataPayload.append(key, currentValue);
        changes[key] = currentValue; // Track change
      }
    };

    // Compare fields and append if changed
    appendIfChanged("name", formData.name || "", initialData.name);
    appendIfChanged(
      "description",
      formData.description || "",
      initialData.description
    );
    appendIfChanged("type", placeType, initialData.type);
    appendIfChanged("state", formData.state || "", initialData.state);
    appendIfChanged(
      "parentPlace",
      placeType === "sub_place" ? formData.parentPlace || null : null,
      initialData.parentPlace
    );
    appendIfChanged(
      "idealTripDuration",
      formData.idealTripDuration || "",
      initialData.idealTripDuration
    );
    appendIfChanged(
      "placeTitle",
      formData.placeTitle || "",
      initialData.placeTitle
    );
    appendIfChanged(
      "placePopular",
      formData.placePopular || "N",
      initialData.placePopular
    );
    appendIfChanged("placeTop", formData.placeTop || "N", initialData.placeTop);
    appendIfChanged(
      "mostPopular",
      formData.mostPopular || "N",
      initialData.mostPopular
    );
    appendIfChanged("distance", formData.distance || "", initialData.distance);
    appendIfChanged(
      "transportOption",
      formData.transportOption || "",
      initialData.transportOption
    );
    appendIfChanged(
      "placeLocation",
      formData.placeLocation || "",
      initialData.placeLocation
    );
    appendIfChanged(
      "travelTipes",
      formData.travelTipes || "",
      initialData.travelTipes
    );
    appendIfChanged(
      "mustVisit",
      formData.mustVisit || "N",
      initialData.mustVisit
    );
    if (formData.images && formData.images.length > 0) {
      for (const image of formData.images) {
        if (typeof image === "string") {
          // Check if the URL is unchanged
          if (!initialData.images.includes(image)) {
            const file = await urlToFile(image, "image.jpg"); // Convert URL to File
            formDataPayload.append("images", file);
          }
        } else if (image instanceof File) {
          // New image added by the user
          formDataPayload.append("images", image);
        }
      }
    } else if (!formData.images || formData.images.length === 0) {
      // If no images are present, do not append the "images" field at all
      console.log("No changes made to images. Skipping the 'images' field.");
    }

    try {
      setStatus("");
      setMessage("");
      setShowAlert(false);

      // Submit updated fields only
      const response = await updatePlaceData(placeId, formDataPayload);
      console.log(response.data, "update");

      fetchFilteredPlaces();

      if (response && response.status === 201) {
        setStatus("success");
        setMessage("Place updated successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to save user!");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      console.error("Error creating place:", error);
      setStatus("error");
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlace(null);
  };

  const handleDelete = async () => {
    console.log("Deleting place:", selectedPlace);
    try {
      setStatus("");
      setMessage("");
      setShowAlert(false);
      const response = await deletePlaceData(selectedPlace._id);
      console.log(response.data);
      fetchFilteredPlaces();
      if (response && response.status === 201) {
        setStatus("success");
        setMessage("Place Deleted SuccessFully");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to save user!");
        setShowAlert(true); // Show error alert
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error creating place:", error);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
    }
  };
  return (
    <div>
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      {/* Dropdown for selecting Place Type (City/Sub-city) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          background: "rgba(239, 21, 108, 0.1)", // Transparent alert-like background
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h4
          style={{
            textAlign: "center",
            color: "#ef156c",
            fontSize: "1.5rem",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          Place Upload
        </h4>

        <div
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
        >
          <FormControl style={{ marginBottom: "20px", width: "300px" }}>
            <InputLabel style={{ color: "#ef156c" }}>
              Select the Type
            </InputLabel>
            <Select
              value={placeType}
              onChange={(e) => setPlaceType(e.target.value)}
              label="Place Type"
              style={{
                background: "white",
                borderRadius: "5px",
                color: "#333",
              }}
            >
              <MenuItem value="city">City</MenuItem>
              <MenuItem value="sub_place">Sub-city</MenuItem>
            </Select>
          </FormControl>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "10px",
            fontStyle: "italic",
            color: "#666",
          }}
        >
          Select the type to view the form
        </p>
      </div>

      {/* Stepper */}

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {activeStep === 0 && (
            <Step1
              formData={formData}
              onFormDataChange={handleFormDataChange}
              stateOptions={stateOptions}
              parentPlaceOptions={parentPlaceOptions}
              subPlaceOptions={subPlaceOptions}
              placeType={placeType} // Pass placeType as prop
            />
          )}
          {activeStep === 1 && (
            <Step2
              formData={formData}
              onFormDataChange={handleFormDataChange}
              placeType={placeType} // Pass placeType as prop
            />
          )}
          {activeStep === 2 && (
            <Step3
              formData={formData}
              onFormDataChange={handleFormDataChange}
              placeType={placeType} // Pass placeType as prop
            />
          )}
          {activeStep === 3 && (
            <Step4
              formData={formData}
              onFormDataChange={handleFormDataChange}
              placeType={placeType} // Pass placeType as prop
            />
          )}

          <div style={{ marginTop: 20 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              style={{
                border: "2px solid #ef156c",
                color: "#ef156c",
                textTransform: "none",
                cursor: "pointer",
                marginRight: 10,
              }}
            >
              Back
            </Button>
            <Button
              onClick={
                activeStep === steps.length - 1
                  ? placeId && placeId
                    ? handleUpdate
                    : handleSubmit
                  : handleNext
              }
              style={{
                backgroundColor: "#ef156c",
                textTransform: "none",
                color: "white",
                cursor: "pointer",
              }}
            >
              {activeStep === steps.length - 1
                ? placeId && placeId
                  ? "Update"
                  : "Submit"
                : "Next"}{" "}
            </Button>
          </div>
        </>
      )}
      <hr />
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Place Details</h4>
      </div>
      {/* Filters */}
      {/* <div style={{ marginTop: "20px", display: "flex", gap: "16px" }}>
        <FormControl style={{ width: "200px" }}>
          <InputLabel>State</InputLabel>
          <Select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            {stateOptions.map((state) => (
              <MenuItem key={state._id} value={state.stateName}>
                {state.stateName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{ width: "200px" }}>
          <InputLabel>City</InputLabel>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {parentPlaceOptions.map((city) => (
              <MenuItem key={city._id} value={city.cityName}>
                {city.cityName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Search"
          value={search}
          onChange={handleSearchChange}
          style={{ flexGrow: 1 }}
        />
      </div> */}
      <div className="mt-3 d-flex gap-3">
        {/* State Dropdown */}
        <div style={{ width: "200px" }}>
          <label htmlFor="state" className="form-label">
            State
          </label>
          <select
            id="state"
            className="form-select"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          >
            <option value="">-- Select a state --</option>
            {stateOptions.map((state) => (
              <option key={state._id} value={state.stateName}>
                {state.stateName}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div style={{ width: "200px" }}>
          <label htmlFor="city" className="form-label">
            City
          </label>
          <select
            id="city"
            className="form-select"
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            {" "}
            <option value="">-- Select a City --</option>
            {parentPlaceOptions.map((city) => (
              <option key={city._id} value={city.cityName}>
                {city.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div style={{ flexGrow: 1 }}>
          <label htmlFor="search" className="form-label">
            Search
          </label>
          <input
            type="text"
            id="search"
            className="form-control"
            value={search}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {selectedState && selectedCity && (
        <>
          {/* Table */}
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover mt-4">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Place Location</th>
                      <th>Distance</th>
                      <th>Actions</th> {/* Action buttons */}
                    </tr>
                  </thead>
                  <tbody>
                    {places.map((place) => (
                      <tr key={place._id}>
                        <td>
                          {place.images && place.images.length > 0 ? (
                            <img
                              src={constructImageURL(
                                place.images[place.images.length - 1]
                              )} // Assuming the first image is used for display
                              alt={place.name}
                              style={{
                                width: "100px",
                                height: "70px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          ) : (
                            "No Image"
                          )}
                        </td>
                        <td>{place.name}</td>
                        <td>{place.type}</td>
                        <td>{place.placeLocation || "N/A"}</td>
                        <td>{place.distance || "N/A"}</td>
                        <td>
                          {/* Action Buttons with Tooltips */}
                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="view-tooltip">View Details</Tooltip>
                            }
                          >
                            <button
                              className="btn btn-link p-0"
                              onClick={() => handleShowModal(place, "view")}
                              title="View Details"
                            >
                              <FontAwesomeIcon
                                icon={faEye}
                                className="fs-5 text-primary"
                              />
                            </button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="edit-tooltip">Edit</Tooltip>}
                          >
                            <button
                              className="btn btn-link p-0 ms-2"
                              onClick={() => handleEdit(place)}
                              title="Edit"
                            >
                              <FontAwesomeIcon
                                icon={faEdit}
                                className="fs-5 text-warning"
                              />
                            </button>
                          </OverlayTrigger>

                          <OverlayTrigger
                            placement="top"
                            overlay={
                              <Tooltip id="delete-tooltip ">Delete</Tooltip>
                            }
                          >
                            <button
                              className="btn btn-link p-0 ms-2"
                              onClick={() => handleShowModal(place, "delete")}
                              title="Delete"
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="fs-5 text-danger"
                              />
                            </button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal for View Details or Delete */}
              <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {selectedPlace && selectedPlace.type === "view"
                      ? `View Details of ${selectedPlace.name}`
                      : selectedPlace && selectedPlace.type === "delete"
                      ? `Delete ${selectedPlace.name}`
                      : ""}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedPlace && selectedPlace.type === "view" ? (
                    <div>
                      <p>
                        <strong>Name:</strong> {selectedPlace.name}
                      </p>
                      <p>
                        <strong>Type:</strong> {selectedPlace.type}
                      </p>
                      <p>
                        <strong>Location:</strong> {selectedPlace.placeLocation}
                      </p>
                      <p>
                        <strong>Distance:</strong> {selectedPlace.distance}
                      </p>
                      {/* Add any other details here */}
                    </div>
                  ) : selectedPlace && selectedPlace.type === "delete" ? (
                    <div>
                      <p>
                        Are you sure you want to delete {selectedPlace.name}?
                      </p>
                      <p>This action cannot be undone.</p>
                    </div>
                  ) : (
                    <div>Editing {selectedPlace ? selectedPlace.name : ""}</div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  {selectedPlace && selectedPlace.type === "delete" ? (
                    <>
                      <Button
                        style={{
                          border: "2px solid #ef156c",
                          color: "#ef156c",
                          textTransform: "none",
                          cursor: "pointer",
                          marginRight: 10,
                        }}
                        onClick={handleCloseModal}
                      >
                        Cancel
                      </Button>
                      <Button
                        style={{
                          backgroundColor: "#ef156c",
                          textTransform: "none",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={handleDelete}
                      >
                        Delete
                      </Button>
                    </>
                  ) : selectedPlace && selectedPlace.type === "view" ? (
                    <Button
                      style={{
                        backgroundColor: "#ef156c",
                        textTransform: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={handleCloseModal}
                    >
                      Close
                    </Button>
                  ) : (
                    <Button
                      style={{
                        backgroundColor: "#ef156c",
                        textTransform: "none",
                        color: "white",
                        cursor: "pointer",
                      }}
                      onClick={handleCloseModal}
                    >
                      Save Changes
                    </Button>
                  )}
                </Modal.Footer>
              </Modal>

              {/* Pagination */}
              <div
                className="d-flex justify-content-between"
                style={{ marginTop: "20px" }}
              >
                <Button
                  onClick={() =>
                    setPage((prevPage) => Math.max(prevPage - 1, 1))
                  }
                  disabled={page === 1}
                  style={{
                    border: "2px solid #ef156c",
                    color: "#ef156c",
                    textTransform: "none",
                    cursor: "pointer",
                    marginRight: 10,
                  }}
                >
                  Previous
                </Button>
                <span>
                  Page {page} of {totalPages}
                </span>
                <Button
                  onClick={() =>
                    setPage((prevPage) => Math.min(prevPage + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  style={{
                    backgroundColor: "#ef156c",
                    textTransform: "none",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Places;
