const express = require("express");
const {
  createReview,
  getAllReviews,
  getReviewsByPackageId,
  updateReview,
  deleteReview,
  getAllReviewsForAdminPage
} = require("../Controller/reviewController");

const router = express.Router();

// Route to create a new review
router.post("/create-review", createReview); // POST /create-review

// Route to get all reviews
router.get("/get-all-reviews", getAllReviews); // GET /get-all-reviews

router.get("/get-all-reviews-for-admin-page", getAllReviewsForAdminPage); // GET /get-all-reviews

// Route to get reviews for a specific package
router.get("/get-reviews-by-package/:packageId", getReviewsByPackageId); // GET /get-reviews-by-package/:packageId

// Route to update a review by ID
router.put("/update-review/:reviewId", updateReview); // PUT /update-review/:reviewId

// Route to delete a review by ID
router.delete("/delete-review/:reviewId", deleteReview); // DELETE /delete-review/:reviewId

module.exports = router;
