import React from "react";

const ReviewCard = ({ review, renderStars }) => {
    <div className="card p-3 shadow-sm d-flex mt-5 review-carousel ">
      <div className="d-flex justify-content-between mb-3">
        {/* Avatar and Name */}
        <div className="d-flex align-items-center">
          <div className="avatar me-3">
            {review.name.charAt(0).toUpperCase()} {/* First letter of name */}
          </div>
          <div>
            <h5 className="mb-0">{review.name}</h5>
            <small className="text-muted">{review.orderId.username}</small>
          </div>
        </div>
        {/* Date */}
        <div className="text-muted small">
          {new Date(review.orderId.date).toLocaleDateString()} {/* Format Date */}
        </div>
      </div>
      {/* Rating */}
      <div className="rating mb-3 text-muted">
        {renderStars(review.tourRating)} {/* Dynamic Rating */}
      </div>
      {/* Comments */}
      <p className="fw-bold mb-2">{review.comments}</p>
      {/* Package Details */}
      <p>
        <strong>Package:</strong> {review.orderId.packageId.name}
      </p>
      <p>
        <strong>Description:</strong>{" "}
        {review.orderId.packageId.packageDescription}
      </p>
      <p>
        <strong>Duration:</strong> {review.orderId.packageId.duration}
      </p>
      <small className="text-muted">
        <strong>Price:</strong> ${review.orderId.packageId.price}
      </small>
    </div>
  
};
export default ReviewCard;