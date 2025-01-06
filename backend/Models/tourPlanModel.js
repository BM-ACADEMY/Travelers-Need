const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema({
  day: { type: Number, required: true },
  title: { type: String, required: true },
  activities: [{ type: String, required: true }],
  places: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }],
  startTime: { type: String },
  endTime: { type: String },
});

const tourPlanSchema = new mongoose.Schema({
  tourCode: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  itSummaryTitle: { type: String, required: true },
  addressId: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  startPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  endPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
  duration: { type: String, required: true },
  enableIcons: { type: String, enum: ["Y", "N"], default: "N" },
  baseFare: { type: Number, required: true },
  origFare: { type: Number, required: true },
  tourType:{type:String,required:true,enum:["D","I"]},
  itPopular: { type: String, enum: ["Y", "N"], default: "N" },
  itTop: { type: String, enum: ["Y", "N"], default: "N" },
  itTourPlan: { type: String, enum: ["Y", "N"], default: "N" },
  itinerary: [itinerarySchema],
  inclusions: [{ type: String }],
  exclusions: [{ type: String }],
  optional: [{ type: String }],
  themeId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Theme"}],
  images: {
    type: [String], // Array of image URLs or file paths
    default: [],
    validate: {
      validator: (v) => v.every((url) => /^[^<>:;,?"*|]+$/.test(url)),
      message: "One or more image paths are invalid",
    },
  },
 
}, { timestamps: true });

module.exports = mongoose.model("TourPlan", tourPlanSchema);
