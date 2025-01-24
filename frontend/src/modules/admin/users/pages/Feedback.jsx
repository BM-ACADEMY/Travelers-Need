import React, { useState, useEffect } from "react";
import axios from "axios";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
import {
  Container,
  Row,
  Col,
  Card,
  Dropdown,
  DropdownButton,
  Pagination,
} from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import moment from "moment";
import {fetchAllReviewsForAdmin} from "../../services/ApiService";

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Feedback = () => {
  const [reviews, setReviews] = useState([]);
  const [barChartData, setBarChartData] = useState({});
  const [ratingCounts, setRatingCounts] = useState({
    poor: 0,
    good: 0,
    excellent: 0,
  });
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState("0.0");
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { setComponentName } = useComponentName();

  useEffect(() => {
    setComponentName("Feedback");
  }, [setComponentName]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetchAllReviewsForAdmin(currentPage, 10, filter);

      const data = response.data;

      if (data) {
        setLoading(false);
        setReviews(data.reviews || []);
        setBarChartData(data.barChartData || {});
        setRatingCounts(
          data.ratingCounts || { poor: 0, good: 0, excellent: 0 }
        );
        setAverageRating(data.averageRating || "0.0");
        setTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [filter, currentPage]);

  const handlePaginationClick = (page) => {
    setCurrentPage(page);
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
    <Container fluid>
       <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Review Dashboard</h4>
      </div>
      <Row className="mt-3">
        {/* Left Side Bar Chart */}
        <Col md={6} sm={12} className="mb-3">
          <Card>
            <Card.Header>Reviews by Month</Card.Header>
            <Card.Body>
              {barChartData?.labels?.length ? (
                <Bar data={barChartData} />
              ) : (
                <div>Loading chart data...</div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right Side Rating Card */}
        <Col md={6} sm={12} className="mb-3">
          <Card>
            <Card.Header>Overall Rating</Card.Header>
            <Card.Body>
              <h3>{averageRating}</h3>
              <div className="d-flex">
                <div
                  className={`badge ${
                    ratingCounts.excellent > ratingCounts.good &&
                    ratingCounts.excellent > ratingCounts.poor
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  Excellent: {ratingCounts.excellent}
                </div>
                <div
                  className={`badge ${
                    ratingCounts.good > ratingCounts.poor
                      ? "bg-warning"
                      : "bg-danger"
                  }`}
                >
                  Good: {ratingCounts.good}
                </div>
                <div className="badge bg-danger">Poor: {ratingCounts.poor}</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <hr />
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Review Cards</h4>
      </div>
      {/* Filter Dropdown */}
      <Row className="mt-3">
        <Col sm={12}>
          <DropdownButton
            id="filter-dropdown"
            title={`Filter by: ${filter}`}
            onSelect={(e) => setFilter(e)}
            className="w-100"
          >
            <Dropdown.Item eventKey="all">All</Dropdown.Item>
            <Dropdown.Item eventKey="today">Today</Dropdown.Item>
            <Dropdown.Item eventKey="lastWeek">Last Week</Dropdown.Item>
            <Dropdown.Item eventKey="lastMonth">Last Month</Dropdown.Item>
            <Dropdown.Item eventKey="thisYear">This Year</Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>

      {/* Reviews Grid */}
      <Row className="mt-3">
        {reviews?.length > 0 ? (
          reviews.map((review) => (
            <Col key={review._id} sm={12} md={6} lg={4} className="mb-4 ">
              <Card>
                <Card.Body>
                  <Card.Title>{review.tourPlan?.title}</Card.Title>
                  <Card.Subtitle className="mb-2 " style={{ color: "#ef156c",fontSize:"bold" }}>
                    {review.name} ({review.email})
                  </Card.Subtitle>
                  <Card.Text >Rating: {review.tourRating} / 5</Card.Text>
                  <Card.Text
                    className="fw-bold overflow-y-scroll"
                    style={{ height: "20vh" }}
                  >
                    {review.comments}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col sm={12} className="text-center">
            <h5>No reviews found</h5>
          </Col>
        )}
      </Row>
      {/* Pagination */}
      <Row className="mt-3">
        <Col className="text-center">
          <Pagination>
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={currentPage === index + 1}
                onClick={() => handlePaginationClick(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default Feedback;
