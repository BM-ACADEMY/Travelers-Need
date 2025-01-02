const Place = require("../Models/placeModel");
const fs = require("fs-extra");
const path = require("path");

const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "places");

// Helper function: Create folder dynamically for a place
const createPlaceFolder = async (placeName) => {
  const folder = path.join(UPLOADS_ROOT, placeName.replace(/ /g, "_"));
  await fs.ensureDir(folder);
  return folder;
};

// 1. Create a city or sub-place
exports.createPlace = async (req, res) => {
  try {
    const {
      name,
      description,
      state,
      type, // city or sub_place
      parentPlace,
      bestTimetoVisit,
      idealTripDuration,
      distance,
      placeLocation,
      travelTipes,
      transportOption,
      transport,
      networkSettings,
      weatherInfo,
      placeTitle,
      mustVisit
    } = req.body;

    // Validate the type
    if (!["city", "sub_place"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'city' or 'sub_place'." });
    }

    // Validate parentPlace for sub_place
    if (type === "sub_place" && !parentPlace) {
      return res.status(400).json({ message: "Sub-places must have a parent place." });
    }

    // Create folder dynamically for the place
    const placeFolder = await createPlaceFolder(name);

    // Rename and move uploaded files
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(placeFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
    }


    // Create a new place document
    const newPlace = new Place({
      name,
      description,
      state,
      type,
      parentPlace: type === "sub_place" ? parentPlace : null,
      images,
      bestTimetoVisit,
      idealTripDuration,
      transport: transport ? JSON.parse(transport) : [],
      networkSettings: networkSettings ? JSON.parse(networkSettings) : {},
      weatherInfo: weatherInfo ? JSON.parse(weatherInfo) : {},
      placeTitle,
      distance,
      placeLocation,
      travelTipes,
      transportOption,
      mustVisit
    });

    await newPlace.save();

    // If sub_place, update the parentPlace's subPlaces field
    if (type === "sub_place" && parentPlace) {
      await Place.findByIdAndUpdate(parentPlace, {
        $addToSet: { subPlaces: newPlace._id },
      });
    }

    res.status(201).json({ message: "Place created successfully", place: newPlace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all cities
exports.getAllCities = async (req, res) => {
  try {
    const cities = await Place.find({ type: "city" }).populate("state", "country state city");
    res.json({ message: "All cities retrieved", cities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. Get all sub-places for a city
exports.getSubPlaces = async (req, res) => {
  try {
    const { cityId } = req.params;

    const city = await Place.findById(cityId)
      .populate("state", "country state city")
      .populate("subPlaces", "name description images");

    if (!city || city.type !== "city") {
      return res.status(404).json({ message: "City not found or invalid ID." });
    }

    res.json({ message: "Sub-places retrieved successfully", subPlaces: city.subPlaces });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. Update a place
exports.updatePlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const updatedData = req.body;

    // Handle file uploads
    if (req.files) {
      const placeFolder = await createPlaceFolder(req.body.name || "default");
      const images = [];
      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(placeFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
      updatedData.images = images;
    }

    const updatedPlace = await Place.findByIdAndUpdate(placeId, updatedData, { new: true });

    if (!updatedPlace) {
      return res.status(404).json({ message: "Place not found" });
    }

    res.json({ message: "Place updated successfully", place: updatedPlace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete a place
exports.deletePlace = async (req, res) => {
  try {
    const { placeId } = req.params;

    const place = await Place.findByIdAndDelete(placeId);

    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }

    // If sub_place, remove from the parent's subPlaces array
    if (place.type === "sub_place" && place.parentPlace) {
      await Place.findByIdAndUpdate(place.parentPlace, {
        $pull: { subPlaces: place._id },
      });
    }

    // Optionally delete the folder associated with this place
    const placeFolder = path.join(UPLOADS_ROOT, place.name.replace(/ /g, "_"));
    await fs.remove(placeFolder);

    res.json({ message: "Place deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
