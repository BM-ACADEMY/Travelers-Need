import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Modal, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import AlertMessage from "../../../reusableComponents/AlertMessage";
import {
  fetchAllTourPlansSearch,
  fetchAllTourPlansSearchByCity,
  deleteTourPlan,
  fetchImageTourPlan,
} from "../../../services/ApiService";
const TourPlansTable = ({ onEditTourPlan, successMessage }) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [tourPlans, setTourPlans] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    currentPage: 1,
    totalPages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedTourPlan, setSelectedTourPlan] = useState(null); // For storing the selected tour plan for viewing/editing
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [tourPlanId, setTourPlanId] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const VITE_GET_IMAGE_FOR_TOUR_PLAN = import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN.startsWith(
    "http"
  )
    ? import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN}`;

  const generateImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg";

    const [tourCode, fileName] = imagePath.split("\\");

    return `${VITE_GET_IMAGE_FOR_TOUR_PLAN}?tourCode=${encodeURIComponent(
      tourCode?.toLowerCase() || ""
    )}&fileName=${encodeURIComponent(fileName || "")}`;
  };

  // Fetch all cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetchAllTourPlansSearch();
        setCities(response.data.destinations);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  // Fetch tour plans when the selected city or page changes
  useEffect(() => {
    if (selectedCity) {
      fetchTourPlans();
    }
  }, [selectedCity, pagination.currentPage, successMessage]);
  //   if (successMessage == true) {
  //     fetchTourPlans();
  //   }

  const fetchTourPlans = async (searchTermValue = "") => {
    setLoading(true);
    try {
      const response = await fetchAllTourPlansSearchByCity(
        selectedCity,
        searchTermValue,
        searchTerm,
        pagination.currentPage
      );
      setTourPlans(response.data.tourPlans);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching tour plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handleShowModal = (place, type) => {
    setTourPlanId(place._id);
    setSelectedPlace({ ...place, type });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPlace(null);
  };

  const handleDelete = async (tourPlan) => {
    console.log("Deleting place:", selectedPlace);
    // Perform delete action here
    handleCloseModal();
    try {
      setStatus("");
      setMessage("");
      setShowAlert(false);
      const response = await deleteTourPlan(tourPlanId);
      console.log(response.data);
      fetchTourPlans();
      if (response && response.status === 201) {
        setStatus("success");
        setMessage("TourPlan Deleted successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to Delete TourPlan!");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      console.log("console error", error);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true);
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  // Utility function to generate image URL

  // Handle View button click to open modal with selected tour plan details
  const handleViewClick = (plan) => {
    setSelectedTourPlan(plan); // Set the selected tour plan for viewing in the modal
  };

  // Handle Edit button click to pass the selected tour plan to the parent component
  const handleEditClick = (plan) => {
    onEditTourPlan(plan); // Pass the selected plan to the parent component
  };

  // Handle Delete button click
  // const handleDeleteClick = async (planId) => {
  //   try {
  //     await axios.delete(`http://localhost:3000/api/tour-plans/${planId}`);
  //     fetchTourPlans(); // Refresh the list after deletion
  //   } catch (error) {
  //     console.error("Error deleting tour plan:", error);
  //   }
  // };

  return (
    <div className="container mt-4">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <h2>Tour Plans</h2>
      <div className="mb-3">
        <label htmlFor="citySelect" className="form-label">
          Select City
        </label>
        <select
          id="citySelect"
          className="form-select"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option value="">-- Select a City --</option>
          {cities.map((city) => (
            <option key={city._id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="search" className="form-label">
          Search Tour Plans
        </label>
        <input
          type="text"
          id="search"
          className="form-control"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchTourPlans(e.target.value); // Fetch results on input change
          }}
          placeholder="Enter tour title"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Base Fare</th>
                  <th>Summary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tourPlans.length > 0 ? (
                  tourPlans.map((place) => {
                    // Generate the image URL with a regular function
                    const imageUrl = place.images?.[0]
                      ? generateImageUrl(place.images[0])
                      : "placeholder.jpg";

                    return (
                      <tr key={place._id}>
                        <td>
                          <img
                            src={imageUrl}
                            alt="Tour"
                            width={50}
                            onError={(e) => (e.target.src = "placeholder.jpg")}
                          />
                        </td>
                        <td>{place.title}</td>
                        <td>{place.baseFare}</td>
                        <td>{place.itSummaryTitle}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <OverlayTrigger
                              placement="top"
                              overlay={
                                <Tooltip>View details about this place</Tooltip>
                              }
                            >
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => handleShowModal(place, "view")}
                              >
                                View
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Edit this place</Tooltip>}
                            >
                              <button
                                className="btn btn-warning btn-sm"
                                onClick={() => handleEditClick(place)}
                              >
                                Edit
                              </button>
                            </OverlayTrigger>
                            <OverlayTrigger
                              placement="top"
                              overlay={<Tooltip>Delete this place</Tooltip>}
                            >
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleShowModal(place, "delete")}
                              >
                                Delete
                              </button>
                            </OverlayTrigger>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No tour plans available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            {Array.from({ length: pagination.totalPages }).map((_, index) => (
              <button
                key={index}
                className={`btn btn-sm ${
                  pagination.currentPage === index + 1
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Modal for View and Delete */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPlace?.type === "view" && "View Place Details"}
            {selectedPlace?.type === "delete" && "Confirm Delete"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPlace?.type === "view" && (
            <div>
              <h5>{selectedPlace.title}</h5>
              <p>{selectedPlace.itSummaryTitle}</p>
              <p>
                <strong>Base Fare:</strong> {selectedPlace.baseFare}
              </p>
              {/* Additional details can be added here */}
            </div>
          )}
          {selectedPlace?.type === "delete" && (
            <div>
              <p>Are you sure you want to delete this place?</p>
              <p>
                <strong>{selectedPlace.title}</strong>
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          {selectedPlace?.type === "delete" && (
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TourPlansTable;
