import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Review = () => {
  const [reviews, setReviews] = useState([]); // State to store fetched reviews
  const [page, setPage] = useState(1); // Current page for pagination
  const [hasMore, setHasMore] = useState(true); // Track if there are more records to fetch
  const [isFetching, setIsFetching] = useState(false); // Prevent multiple fetch calls
  const navigate = useNavigate();

  const baseurl = import.meta.env.VITE_BASE_URL; // Base URL for API

  // Fetch reviews from API
  const fetchReviews = async () => {
    if (isFetching) return; // Prevent duplicate fetch calls
    setIsFetching(true);

    try {
      const response = await axios.get(`${baseurl}/reviews/get-all-reviews`, {
        params: { page, limit: 5 }, // Fetch 5 reviews per request
      });
      const fetchedReviews = response.data.reviews;
      const totalPages = response.data.totalPages;

      setReviews((prevReviews) => {
        // Filter out duplicate reviews based on _id
        const newReviews = fetchedReviews.filter(
          (review) => !prevReviews.some((prev) => prev._id === review._id)
        );
        return [...prevReviews, ...newReviews];
      });

      // Check if there are more pages
      setHasMore(page < totalPages);
    } catch (error) {
      console.error("Error fetching reviews:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  // Initial fetch of reviews
  useEffect(() => {
    fetchReviews();
  }, [page]);

  const renderStars = (rating) => {
    const fullStar = "★";
    const emptyStar = "☆";
    return fullStar.repeat(rating) + emptyStar.repeat(5 - rating);
  };

  const handleReadMore = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1); // Increment page to fetch next records
    }
  };

  const handleWriteReview = () => {
    navigate("/write-review");
  };

  return (
    <div className="container mt-5">
     <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Reviews  </h4>
      </div>
      <hr />
      <div>
        {reviews.map((review, index) => (
          <div key={index} className="card p-3 shadow-sm mb-4">
            <div className="d-flex justify-content-between">
              {/* User Info */}
              <div className="d-flex align-items-center">
                <div
                  className="avatar me-3 text-white d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "#ef156c",
                    fontSize: "20px",
                  }}
                >
                  {review.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h5 className="mb-0">{review.name}</h5>
                  <small className="text-muted">
                    {/* {review.bookingDetails?.username || "Unknown Location"} */}
                  </small>
                </div>
              </div>
              {/* Date */}
              <div className="text-muted small">
                {new Date(review?.createdAt).toLocaleDateString()}
              </div>
            </div>
            {/* Rating */}
            <div className="rating mb-3 text-muted">
              {renderStars(review.tourRating)}
            </div>
            {/* Comments */}
            <p className="fw-bold mb-2">{review.comments}</p>
            {/* Package Details */}
            <p>
              <strong>Package:</strong> {review.tourPlan?.title || "N/A"}
            </p>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4 gap-3">
        {hasMore && (
          <button
            className="btn btn-outline-danger"
            onClick={handleReadMore}
            style={{
              textTransform: "none",
            }}
          >
            Load More Reviews
          </button>
        )}
        <button
          className="btn btn-danger text-white"
          onClick={handleWriteReview}
          style={{
            textTransform: "none",
          }}
        >
          Write a Review
        </button>
      </div>
    </div>
  );
};

export default Review;
