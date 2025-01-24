import React, { useState, useEffect } from "react";
import axios from "axios";
import { Doughnut } from "react-chartjs-2";
import "bootstrap/dist/css/bootstrap.min.css";
import { useComponentName } from "../../hooks/ComponentnameContext";
import { useUser } from "../../hooks/UserContext";
import {fetchAllBookingsByUserIdForDashboard} from "../admin/services/ApiService";
const Dashboard = ({ userId }) => {
  const { setComponentName } = useComponentName();
  const { user, logout } = useUser();
  useEffect(() => {
    setComponentName("Dahboard");
  }, [setComponentName]);
  const [summary, setSummary] = useState({
    newBooking: { title: "New Booking", count: 0 },
    totalBooking: { title: "Total Bookings", count: 0 },
    bookingCompleted: { title: "Completed Bookings", count: 0 },
    cancelBooking: { title: "Cancelled Bookings", count: 0 },
  });
  const [bookings, setBookings] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // Items per page
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:3000/api/bookings/get-all-booking-by-userId-for-dashboard/${user.userId}?page=${page}&limit=${limit}`
      );
      fetchAllBookingsByUserIdForDashboard(user.userId,page,limit)
      if (data) {
        setLoading(false);
      }
      setSummary(data?.summary);
      setBookings(data?.bookings);
      setTotalPages(data?.pagination?.totalPages);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, userId]);

  // Chart data
  const chartData = {
    labels: ["Completed", "Cancelled"],
    datasets: [
      {
        data: [summary?.bookingCompleted?.count, summary?.cancelBooking?.count],
        backgroundColor: ["#4caf50", "#f44336"],
        hoverBackgroundColor: ["#66bb6a", "#ef5350"],
      },
    ],
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
      {/* Summary Cards */}
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Booking Dashboard</h4>
      </div>

      <div className="row">
        {Object.values(summary || {}).map((item, index) => (
          <div className="col-md-3" key={index}>
            <div
              className="card shadow-md p-3 mb-4"
              style={{
                transition: "transform 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{item.title}</h5>
                  <h3 style={{ color: "#ef156c" }}>{item.count}</h3>
                </div>
                <div style={{ width: "60px", height: "60px" }}>
                  <Doughnut data={chartData} options={{ cutout: "70%" }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Recent Booking Details</h4>
      </div>

      {/* Bookings Table */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Bookings</h5>
          <div className="table table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Package</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {bookings?.length > 0 ? (
                  bookings?.map((booking, index) => (
                    <tr key={index}>
                      <td>{(page - 1) * limit + index + 1}</td>
                      <td>{booking?.userId?.username || "N/A"}</td>
                      <td>{booking?.packageId?.title || "N/A"}</td>
                      <td>
                        <span
                          className={`badge ${
                            booking?.status === "Confirmed"
                              ? "bg-success"
                              : booking?.status === "Cancelled"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {booking?.status}
                        </span>
                      </td>
                      <td>
                        {new Date(booking?.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No bookings available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn btn-primary"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-primary"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
