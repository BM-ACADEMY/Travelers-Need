import React, { useEffect, useState } from "react";
import { useComponentName } from "../../hooks/ComponentnameContext";
import { Modal, Button, OverlayTrigger } from "react-bootstrap";
import { useUser } from "../../hooks/UserContext";
import AlertMessage from "../admin/reusableComponents/AlertMessage";
import {updateBookingStatus,fetchAllBookingsByUserId} from "../admin/services/ApiService";
import axios from "axios";
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day} - ${month} ${day}`;
};

const formatDuration = (duration) => {
  const days = duration;
  const nights = duration > 1 ? duration - 1 : 0;
  return `${days} Days / ${nights} Night${nights !== 1 ? "s" : ""}`;
};

const Booking = () => {
  const { setComponentName } = useComponentName();
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const { user, logout } = useUser();
  useEffect(() => {
    setComponentName("Booking");
  }, [setComponentName]);

  useEffect(() => {
    fetchAllBookingData();
  }, []);
  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      setStatus("");
      setMessage("");
      setShowAlert(false);
      const response = await updateBookingStatus(bookingId,newStatus)
      
      if (response && response.status === 201) {
        setLoading(false);
        fetchAllBookingData();
        setStatus("success");
        setMessage("Booking updated successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to save Booking!");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error updating status", error);
    }
  };
  const fetchAllBookingData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllBookingsByUserId(user.userId);
      const data = response.data;
      if (data) {
        setLoading(false);
      }
      // Set state variables based on the response
      setBookings(data.bookings);
      setFilteredData(data.bookings); // Initially show all bookings
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data: ", error);
    }
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "5px",
          padding: "8px",
          backgroundColor: "#ef156c",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }
  return (
    <div className="mt-3 row col-12">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <div className="mt-3 mb-3">
            <h4 style={{ color: "#ef156c" }}>Booking Details</h4>
          </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* <div className="input-group w-50">
          <input
            type="text"
            className="form-control"
            placeholder="Search name, package, etc"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div>
          <select
            className="form-select me-2"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="today">Today</option>
            <option value="week">Last Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <Button variant="primary" onClick={handleBookingOpen}>
            + Add Booking
          </Button>
        </div> */}
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Title</th>
              <th>Duration</th>
              <th>Phone Number</th>
              <th>Date</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index}>
                <td>{item.userId.username}</td>
                <td>{item.packageId.title}</td>
                <td>{formatDuration(item.packageId.duration)}</td>
                <td>{item.phoneNumber}</td>
                <td>{formatDate(item.updatedAt)}</td>
                <td>₹{item.price.toLocaleString()}</td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) =>
                      handleStatusChange(item._id, e.target.value)
                    }
                    className={`form-select badge ${
                      item.status === "Confirmed"
                        ? "bg-success"
                        : item.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Click the text to select a status"
                  >
                    <option value="Confirmed" className="bg-success">
                      Confirmed
                    </option>
                    <option value="Pending" className="bg-warning text-dark">
                      Pending
                    </option>
                    <option value="Cancelled" className="bg-danger">
                      Cancelled
                    </option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <div>
          <strong>Total Records: {filteredData.length}</strong>
        </div>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={handlePrevious}>
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button className="page-link" onClick={handleNext}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Booking;
