import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Table } from "react-bootstrap";
import {fetchAllAddressesForAdmin} from "../../../services/ApiService";
// const getImageURL = (imagePath) => {
//   let stateImageURL = "";
//   if (imagePath) {
//     const parts = imagePath.split("\\"); // Split the path by backslashes
//     const fileName = parts.pop(); // Get the file name
//     const stateCode = parts.length > 0 ? parts[0] : "Unknown"; // Get the state code

//     // Construct and return the image URL
//     stateImageURL = `http://localhost:3000/api/address/get-image?state=${encodeURIComponent(
//       stateCode
//     )}&fileName=${encodeURIComponent(fileName)}`;
//   }
//   return stateImageURL;
// };
const AddressTable = ({ onDelete, onEdit }) => {
  const [addresses, setAddresses] = useState([]);
  const [filters, setFilters] = useState({
    country: "",
    state: "",
    city: "",
  });
  const [selectedCountry, setSelectedCountry] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, [filters, pagination.currentPage]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
const GET_IMAGE_FOR_ADDRESS_URL = import.meta.env.VITE_GET_IMAGE_FOR_ADDRESS.startsWith("http")
? import.meta.env.VITE_GET_IMAGE_FOR_ADDRESS
: `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_ADDRESS}`;
  const getImageURL = (imagePath) => {
    let stateImageURL = "";
    if (imagePath) {
      const parts = imagePath.split("\\"); // Split the path by backslashes
      const fileName = parts.pop(); // Get the file name
      const stateCode = parts.length > 0 ? parts[0] : "Unknown"; // Get the state code
  
      // Construct and return the image URL using the .env variable
      stateImageURL = `${GET_IMAGE_FOR_ADDRESS_URL}?state=${encodeURIComponent(
        stateCode
      )}&fileName=${encodeURIComponent(fileName)}`;
    }
    return stateImageURL;
  };
  
  const fetchAddresses = async () => {
    const { country, state, city } = filters;
    const { currentPage, limit } = pagination;
   
    try {
      const response = await fetchAllAddressesForAdmin(country, state, city, currentPage, limit);

      console.log(response.data);
      
      setAddresses(response.data.addresses);
      setPagination((prevState) => ({
        ...prevState,
        totalPages: response.data.metadata.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleSearchChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prevState) => ({
      ...prevState,
      currentPage: newPage,
    }));
  };
  const handleDelete = (country) => {
    // onDelete(country);
    setSelectedCountry(country);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCountry(null);
  };

  const handleConfirmDelete = () => {
    onDelete(selectedCountry); 
    setShowModal(false);
  };
  return (
    <div className="container mt-4">
      <h3>Address Table</h3>

      {/* Filters */}
      <div className="mb-3">
        <input
          type="text"
          name="country"
          className="form-control"
          placeholder="Search by country"
          value={filters.country}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="state"
          className="form-control mt-2"
          placeholder="Search by state"
          value={filters.state}
          onChange={handleSearchChange}
        />
        <input
          type="text"
          name="city"
          className="form-control mt-2"
          placeholder="Search by city"
          value={filters.city}
          onChange={handleSearchChange}
        />
      </div>

      {/* Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Country</th>
            <th>State</th>
            <th>City</th>
            <th>Images</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {addresses?.map((address, index) => (
            <tr key={index}>
              <td>{address?.countryName}</td>
              <td>{address.stateName}</td>
              <td>{address.cityName}</td>
              <td>
                {address.images && address.images.length > 0 && (
                  <img
                    src={getImageURL(address.images[0])}
                    alt={address.cityName}
                    style={{ width: "100px", height: "auto" }}
                  />
                )}
              </td>
              <td>₹{address.startingPrice}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button variant="warning" onClick={() => onEdit(address)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(address)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <nav>
        <ul className="pagination">
          {Array.from({ length: pagination.totalPages }, (_, index) => (
            <li
              key={index + 1}
              className={`page-item ${
                pagination.currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              <a className="page-link" href="#!">
                {index + 1}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      {/* Modal for confirmation */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the country:{" "}
          <strong>{selectedCountry?.countryName}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddressTable;
