const mongoose = require("mongoose");

const transportSchema = new mongoose.Schema({
  mode: { type: String, required: true }, // Example: Bus, Train, Flight
  from: { type: String, required: true }, // Example: Chennai
  end: { type: String, required: true }, // Example: Chennai
  distance: { type: Number, required: true }, // Distance in kilometers
  // frequency: { type: String, required: true }, // Example: 10/day
  duration: { type: String, required: true }, // Example: 4 hours
});

const networkSettingsSchema = new mongoose.Schema({
  internetAvailability: { type: String, default: "Moderate" }, // Good, Moderate, None
  stdCode: { type: String }, // Example: +91
  languageSpoken: { type: [String], default: [] }, // Example: ["Tamil", "English"]
  majorFestivals: { type: [String], default: [] }, // Example: ["Pongal", "Diwali"]
  notesOrTips: { type: String }, // Example: "Best time to visit during winter."
});

const weatherInfoSchema = new mongoose.Schema({
  season: [
    {
      title: { type: String, required: [true, "Season title is required"] }, // Example: Winter
      description: { type: String, required: [true, "Season description is required"] }, // Example: Cool and breezy
    },
  ],
  nearestCity: { type: String }, // Example: Pondicherry
  peakSeason: { type: String }, // Example: November to February
});

const placeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Name of the place
    description: { type: String }, // Description of the place
    type: {
      type: String,
      enum: ["city", "sub_place"], // Differentiates between city, main place, and sub-place
      default: "city",
    },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true }, // Links to city-level data
    parentPlace: { type: mongoose.Schema.Types.ObjectId, ref: "Place" }, // Hierarchical relationship
    subPlaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "Place" }], // References sub-places
    images: {
      type: [String], // Array of image URLs or file paths
      default: [],
      validate: {
        validator: (v) => v.every((url) => /^[^<>:;,?"*|]+$/.test(url)),
        message: "One or more image paths are invalid",
      },
    },
    bestTimetoVisit:{type:String},
    idealTripDuration:{type:String,required:true},
    transport: [transportSchema], // Embedded Transport Schema
    networkSettings: networkSettingsSchema, // Embedded Network Settings
    weatherInfo: weatherInfoSchema, // Embedded Weather Info
    placeTitle:{type:String,required:true},
    distance:{type:String},
    placeLocation:{type:String},
    travelTipes:{type:String},
    transportOption:{type:String},
    mustVisit:{type:String},
    placePopular:{type:String,enum:["Y","N"],default:["N"]},
    placeTop:{type:String,enum:["Y","N"],default:["N"]},
    mostPopular:{type:String,enum:["Y","N"],default:["N"]}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Place", placeSchema);
