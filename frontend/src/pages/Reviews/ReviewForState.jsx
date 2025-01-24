import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ReviewForState.css";
import { useNavigate } from "react-router-dom";
const ReviewForState = ({ stateName }) => {
  const [reviews, setReviews] = useState([]); // Holds the list of reviews
  const [currentPage, setCurrentPage] = useState(1); // Tracks the current page for pagination
  const [totalReviews, setTotalReviews] = useState(0); // Total number of reviews
  const [loading, setLoading] = useState(false); // Tracks loading state
  const hasFetchedOnce = useRef(false); // Prevents double fetching during initial load
  const navigate=useNavigate();
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  // Function to fetch reviews from the server
  const fetchReviews = async (page) => {
    try {
      setLoading(true); // Set loading to true during API call
      const response = await axios.get(
        `${BASE_URL}/tour-plans/get-all-tour-plan-reviews-by-state/${stateName}?page=${page}&limit=5`
      );
      const { reviews: newReviews, pagination } = response.data;

      setReviews((prevReviews) => [...prevReviews, ...newReviews]); // Append new reviews to existing reviews
      setCurrentPage(pagination.currentPage); // Update the current page
      setTotalReviews(pagination.totalReviews); // Update the total reviews count
      setLoading(false); // Set loading to false after API call
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setLoading(false);
    }
  };

  // Fetch initial reviews when the component mounts or stateName changes
  useEffect(() => {
    if (!hasFetchedOnce.current) {
      fetchReviews(1); // Fetch the first page of reviews
      hasFetchedOnce.current = true; // Prevent further initial fetch calls
    }
  }, [stateName]);

  // Function to handle "Read More" button click
  const handleReadMore = () => {
    if (reviews.length < totalReviews) {
      fetchReviews(currentPage + 1); // Fetch the next page of reviews
    }
  };

  // Function to handle "Write Review" button click
  const handleWriteReview = () => {
    navigate('/write-review')
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">{totalReviews} {stateName} Tour Reviews</h2>
      <hr />
      <div className="list-group">
        {reviews.map((review, index) => (
          <div key={index} className="list-group-item list-group-item-action">
            <div className="d-flex align-items-start">
              <div
                className="rounded-circle  text-white d-flex justify-content-center align-items-center"
                style={{ width: "50px", height: "50px", fontSize: "20px",backgroundColor:"#ef156c" }}
              >
                {review.name.charAt(0)}
              </div>
              <div className="ms-3 flex-grow-1">
                <h5 className="mb-1">{review.name}</h5>
                <p className="text-muted mb-1">{review.startPlace}</p>
              </div>
              <div className="text-warning d-flex flex-column gap-1">
              <span>{"⭐".repeat(Math.round(review.rating))}</span>
                <small className="text-muted">{new Date(review.date).toLocaleDateString()}</small>
              </div>
            </div>
            <p className="mt-2">{review.comment}</p>
            
          </div>
        ))}
      </div>

     <div className="d-flex gap-2 justify-content-center">
     {reviews.length < totalReviews && (
        <div className="text-center ">
          <button
            className="btn"
            style={{color:"#ef156c",backgroundColor:"white",padding:"8px",borderRadius:"10px",border:"1px solid",borderColor:"1px solid #ef156c"}}
           
            onClick={handleReadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Read More"}
          </button>
        </div>
      )}
      <div className="text-center ">
        <button className="btn "
         style={{color:"white",backgroundColor:"#ef156c",padding:"8px",borderRadius:"10px"}}
        onClick={handleWriteReview}>
          Write Review
        </button>
      </div>
     </div>
    </div>
  );
};

export default ReviewForState;
