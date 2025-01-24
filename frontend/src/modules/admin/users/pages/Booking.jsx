import React, { useEffect, useState } from "react";
import { Modal, Button, OverlayTrigger } from "react-bootstrap";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import TourPlansBookingTable from "./table/TourPlansBookingTable";
import AlertMessage from "../../reusableComponents/AlertMessage";
import {
  updateBookingStatus,
  createBooking,
  fetchAllAddressesForPlaces,
  fetchAllTourPlansForSearchByCity,
  fetchAllBookingsForBooking,
} from "../../services/ApiService";
// import { set } from "mongoose";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString("default", { month: "short" });
  const day = date.getDate();
  return `${month} ${day} - ${month} ${day}`;
};

// Helper function to format the duration
const formatDuration = (duration) => {
  const days = duration;
  const nights = duration > 1 ? duration - 1 : 0;
  return `${days} Days / ${nights} Night${nights !== 1 ? "s" : ""}`;
};

const Booking = () => {
  const { setComponentName } = useComponentName();
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showModal, setShowModal] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [packageFilteredData, setPackageFilteredData] = useState([]);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const [bookings, setBookings] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [topPackages, setTopPackages] = useState([]);
  const [bookingAnalytics, setBookingAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchAllBookingData();
  }, []);

  const fetchAllBookingData = async () => {
    try {
      setLoading(true);
      const response = await fetchAllBookingsForBooking();
      const data = response.data;
      if (data) {
        setLoading(false);
      }
      // Set state variables based on the response
      setBookings(data.bookings);
      setFilteredData(data.bookings); // Initially show all bookings
      setStatistics(data.stats);
      setTopPackages(data.topPackages);
      setBookingAnalytics(data.bookingAnalytics);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data: ", error);
    }
  };
  const handleCityChange = async (event) => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      const city = event.target.value;
      setSelectedCity(city);
      setLoading(true);
      const response = await fetchAllTourPlansForSearchByCity(city);
      console.log(response);

      if (response && response.status === 200) {
        setLoading(false);
        setStatus("success");
        setMessage("Fetch Data successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to Fetch Data!");
        setShowAlert(true); // Show error alert
      }
      setPackageFilteredData(response.data.tourPlans);
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.log(error);
    }
  };

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      setStatus("");
      setMessage("");
      setShowAlert(false);
      const response = await updateBookingStatus(bookingId,newStatus);
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
  const handleCloseModal = () => setShowModal(false);
  useEffect(() => {
    const fetchAddressForFilter = async () => {
      const response = await fetchAllAddressesForPlaces()
      setCities(response.data.cities);
    };
    fetchAddressForFilter();
  }, [selectedCity]);
  // Handle search and filter

  // Handle search and filter
  useEffect(() => {
    const today = new Date();
    const filtered = bookings.filter((item) => {
      const itemDate = new Date(item.updatedAt);

      // Filter by search
      const matchesSearch =
        item.userId.username.toLowerCase().includes(search.toLowerCase()) ||
        item.packageId.title.toLowerCase().includes(search.toLowerCase());

      // Filter by time range
      let matchesFilter = true;
      if (filter === "today") {
        matchesFilter = itemDate.toDateString() === today.toDateString();
      } else if (filter === "week") {
        const lastWeek = new Date(today);
        lastWeek.setDate(today.getDate() - 7);
        matchesFilter = itemDate >= lastWeek && itemDate <= today;
      } else if (filter === "month") {
        matchesFilter =
          itemDate.getMonth() === today.getMonth() &&
          itemDate.getFullYear() === today.getFullYear();
      } else if (filter === "year") {
        matchesFilter = itemDate.getFullYear() === today.getFullYear();
      }

      return matchesSearch && matchesFilter;
    });

    setFilteredData(filtered);
    setCurrentPage(1); // Reset to page 1 when filter or search changes
  }, [search, filter, bookings]);

  // Paginated data
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

  useEffect(() => {
    setComponentName("Booking");
  }, [setComponentName]);
  const handleBookingOpen = () => {
    setIsBookingOpen(true);
  };

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
    <div className="container my-4">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Booking Dashboard</h4>
      </div>
      <div className="row g-4">
        {/* Top Cards */}
        <div className="col-lg-9">
          <div className="row g-4 ">
            {statistics &&
              Object.values(statistics).map((item, index) => (
                <div className="col-md-4" key={index}>
                  <div
                    className="card shadow-lg border-0 "
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title text-muted">
                            {item.title}
                          </h6>
                          <h4 className="card-value">{item.value}</h4>
                          <p className={`small ${item.percentageColor}`}>
                            {item.percentage} from last week
                          </p>
                        </div>
                        <div style={{ width: "70px", height: "70px" }}>
                          <Line
                            data={{
                              labels: [
                                "Week 1",
                                "Week 2",
                                "Week 3",
                                "Week 4",
                                "Week 5",
                              ],
                              datasets: [
                                {
                                  data: item.chartData,
                                  borderColor: "#4e73df",
                                  backgroundColor: "rgba(78, 115, 223, 0.1)",
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              plugins: { legend: { display: false } },
                              scales: {
                                x: { display: false },
                                y: { display: false },
                              },
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div className="row g-4 mt-2 ">
            <div className="card shadow-lg  border-0">
              <div className="card-body">
                <h6 className="card-title">Booking Analytics (Monthly)</h6>
                <Line
                  data={{
                    labels: bookingAnalytics.labels,
                    datasets: [
                      {
                        label: "Bookings",
                        data: bookingAnalytics.data,
                        borderColor: "#4e73df",
                        backgroundColor: "rgba(78, 115, 223, 0.1)",
                        tension: 0.4,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: { legend: { position: "top" } },
                    scales: {
                      x: { title: { display: true, text: "Month" } },
                      y: { title: { display: true, text: "Bookings" } },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Top Packages */}
        <div className="col-lg-3">
          <div className="card border-0 shadow-lg">
            <div className="card-body">
              <h6 className="card-title">Top Packages</h6>
              {/* Doughnut Chart with Center Text */}
              <div style={{ position: "relative" }}>
                <Doughnut
                  data={{
                    labels: topPackages.map((pkg) => pkg.packageName),
                    datasets: [
                      {
                        data: topPackages.map((pkg) => pkg.totalParticipants),
                        backgroundColor: [
                          "#4e73df",
                          "#1cc88a",
                          "#36b9cc",
                          "#f6c23e",
                        ],
                        hoverBackgroundColor: [
                          "#2e59d9",
                          "#17a673",
                          "#2c9faf",
                          "#f4b619",
                        ],
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        callbacks: {
                          label: (context) =>
                            `${
                              context.label
                            }: ${context.raw.toLocaleString()} Participants`,
                        },
                      },
                    },
                  }}
                />
                {/* Center Text */}
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "#4e73df",
                  }}
                >
                  {topPackages.reduce(
                    (sum, pkg) => sum + pkg.totalParticipants,
                    0
                  )}{" "}
                  <br />
                  Participants
                </div>
              </div>

              {/* Top Packages List */}
              <ul className="list-unstyled mt-3">
                {topPackages.map((pkg, index) => (
                  <li
                    key={index}
                    className="mb-2 d-flex justify-content-between"
                  >
                    <div className="d-flex flex-column gap-1">
                      <span>{pkg.packageName}</span>
                      <span className="fw-bold">
                        {pkg.totalParticipants.toLocaleString()} (
                        {pkg.percentage.toFixed(2)}%)
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Booking Details</h4>
      </div>
      {/* Booking Table */}
      <div className="mt-3 row col-12">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="input-group w-50">
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
          </div>
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
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
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
      <div className="mt-3 col-lg-6">
        <label className="form-label">Select City</label>
        <select
          className="form-select"
          value={selectedCity}
          onChange={handleCityChange}
        >
          <option value="">Choose a city</option>
          {cities.map((city, index) => (
            <option key={index} value={city.cityName}>
              {city.cityName}
            </option>
          ))}
        </select>
      </div>
      {isBookingOpen == true && (
        <TourPlansBookingTable packages={packageFilteredData} />
      )}
      {/* Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h5>{currentRecord ? currentRecord.package : ""}</h5>
            <p>
              <strong>Name:</strong> {currentRecord ? currentRecord.name : ""}
            </p>
            <p>
              <strong>Booking Code:</strong>{" "}
              {currentRecord ? currentRecord.code : ""}
            </p>
            <p>
              <strong>Price:</strong> $
              {currentRecord ? currentRecord.price : ""}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {currentRecord ? currentRecord.status : ""}
            </p>
            <p>
              <strong>City:</strong> {currentRecord ? currentRecord.city : ""}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary">Confirm Booking</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Booking;
