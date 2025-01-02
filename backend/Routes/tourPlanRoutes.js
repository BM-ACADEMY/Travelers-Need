const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createTourPlan,
  getAllTourPlans,
  getTourPlanById,
  getTourPlanByTourCode,
  getTourPlansByState,
  updateTourPlan,
  deleteTourPlan,
  getTourPlanImage,
  
} = require("../Controller/tourPlanController");

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ dest: path.join(__dirname, "..", "temp") }); // Temporary folder for uploads

// Routes
router.post("/create-tour-plan", upload.array("images"), createTourPlan); // Create a tour plan
router.get("/get-all-tour-plans", getAllTourPlans); // Retrieve all tour plans
router.get("/tour-plans/state/:stateName", getTourPlansByState);
router.get("/get-tour-plan/:tourPlanId", getTourPlanById); // Retrieve a tour plan by ID
router.put("/update-tour-plan/:tourPlanId", upload.array("images"), updateTourPlan); // Update a tour plan
router.get("/tour-plans/tour-code/:tourCode", getTourPlanByTourCode);
router.delete("/delete-tour-plan/:tourPlanId", deleteTourPlan); // Delete a tour plan
router.get("/get-tour-plan-image", getTourPlanImage); // Serve a tour plan image

module.exports = router;
