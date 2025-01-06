const Place = require("../Models/placeModel");
const fs = require("fs-extra");
const path = require("path");
const Address = require("../Models/addressModel");
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
      mustVisit,
    } = req.body;

    // Validate the type
    if (!["city", "sub_place"].includes(type)) {
      return res
        .status(400)
        .json({ message: "Invalid type. Must be 'city' or 'sub_place'." });
    }

    // Validate parentPlace for sub_place
    if (type === "sub_place" && !parentPlace) {
      return res
        .status(400)
        .json({ message: "Sub-places must have a parent place." });
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
      mustVisit,
    });

    await newPlace.save();

    // If sub_place, update the parentPlace's subPlaces field
    if (type === "sub_place" && parentPlace) {
      await Place.findByIdAndUpdate(parentPlace, {
        $addToSet: { subPlaces: newPlace._id },
      });
    }

    res
      .status(201)
      .json({ message: "Place created successfully", place: newPlace });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getCityDetails = async (req, res) => {
  try {
    const { stateName, cityName } = req.query;

    if (!stateName || !cityName) {
      return res
        .status(400)
        .json({ error: "stateName and cityName are required parameters." });
    }

    // Normalize inputs
    const normalizedStateName = stateName.trim().toLowerCase();
    const normalizedCityName = cityName.trim().toLowerCase();

    // Find the parent place with type "city"
    const parentCity = await Place.findOne({
      type: "city",
      name: { $regex: new RegExp(`^${normalizedCityName}$`, "i") }, // Case-insensitive match
    })
      .populate({
        path: "state", // Populate address details from the Address model
        model: "Address",
      })
      .populate({
        path: "subPlaces", // Populate all subPlaces
        model: "Place",
      });

    if (!parentCity) {
      return res.status(404).json({ error: "Parent city not found." });
    }

    // Fetch all sub-places of the parent place
    const allSubPlaces = parentCity.subPlaces.map((subPlace) => ({
      id: subPlace._id,
      name: subPlace.name,
      description: subPlace.description,
      type: subPlace.type,
      placeTop: subPlace.placeTop,
      images: subPlace.images,
      bestTimetoVisit: subPlace.bestTimetoVisit,
      idealTripDuration: subPlace.idealTripDuration,
      transport: subPlace.transport,
      networkSettings: subPlace.networkSettings,
      weatherInfo: subPlace.weatherInfo,
      placeTitle: subPlace.placeTitle,
      distance: subPlace.distance,
      placeLocation: subPlace.placeLocation,
      travelTips: subPlace.travelTipes,
      transportOption: subPlace.transportOption,
      mustVisit: subPlace.mustVisit,
      placePopular: subPlace.placePopular,
      mostPopular: subPlace.mostPopular,
    }));

    // Filter top places (placeTop: "Y")
    const topPlaces = allSubPlaces.filter((place) => place.placeTop === "Y");

    // Format the response to include all details for parentCity, subPlaces, and topPlaces
    const response = {
      parentCity: {
        id: parentCity._id,
        name: parentCity.name,
        description: parentCity.description,
        type: parentCity.type,
        images: parentCity.images,
        bestTimetoVisit: parentCity.bestTimetoVisit,
        idealTripDuration: parentCity.idealTripDuration,
        transport: parentCity.transport,
        networkSettings: parentCity.networkSettings,
        weatherInfo: parentCity.weatherInfo,
        placeTitle: parentCity.placeTitle,
        distance: parentCity.distance,
        placeLocation: parentCity.placeLocation,
        travelTips: parentCity.travelTipes,
        transportOption: parentCity.transportOption,
        mustVisit: parentCity.mustVisit,
        placePopular: parentCity.placePopular,
        mostPopular: parentCity.mostPopular,
        placeTop: parentCity.placeTop,
        address: parentCity.state, // Include address details populated from the Address model
      },
      allSubPlaces,
      topPlaces,
    };

    res.json({
      message: "Parent city details retrieved successfully",
      data: response,
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

exports.getPopularDestinations = async (req, res) => {
  try {
    // Query for state-level popular destinations
    const statePopularCities = await Place.find({
      type: "city",
      placeTop: "Y", // Filter cities where placeTop is "Y"
    }).populate("state", "country state city");

    // Query for country-level most popular destinations
    const countryPopularCities = await Place.find({
      type: "city",
      mostPopular: "Y", // Filter cities where mostPopular is "Y"
    }).populate("state", "country state city");

    res.json({
      message: "Popular destinations retrieved successfully",
      statePopularCities,
      countryPopularCities,
    });
  } catch (error) {
    console.error("Error fetching popular destinations:", error);
    res.status(500).json({ error: error.message });
  }
};
// 3. Get all sub-places for a city
exports.getSubPlaceByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Place name is required as a query parameter." });
    }

    // Find the sub-place by its name (case-insensitive)
    const subPlace = await Place.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      type: "sub_place",
    })
      .populate("parentPlace", "name state address") // Populate parentPlace to get address and state
      .populate("state", "country state city")
      .populate("subPlaces", "name description images");

    if (!subPlace) {
      return res.status(404).json({ message: "Sub-place not found." });
    }

    // Get the parentPlace details if available
    const parentPlace = subPlace.parentPlace;

    // Check if parentPlace exists and its _id matches the parentPlace of the subPlace
    let parentAddress = null;
    let parentStateId = null;

    if (parentPlace && parentPlace._id.equals(subPlace.parentPlace)) {
      parentAddress = parentPlace.address;
      parentStateId = parentPlace.state; // State ObjectId
    }

    // Include the parentPlace's address and state for the subPlace
    res.json({
      message: "Sub-place retrieved successfully",
      subPlace: {
        id: subPlace._id,
        name: subPlace.name,
        description: subPlace.description,
        images: subPlace.images,
        bestTimetoVisit: subPlace.bestTimetoVisit,
        idealTripDuration: subPlace.idealTripDuration,
        transport: subPlace.transport,
        networkSettings: subPlace.networkSettings,
        weatherInfo: subPlace.weatherInfo,
        placeTitle: subPlace.placeTitle,
        distance: subPlace.distance,
        placeLocation: subPlace.placeLocation,
        travelTips: subPlace.travelTipes,
        transportOption: subPlace.transportOption,
        mustVisit: subPlace.mustVisit,
        address: parentAddress || subPlace.address, // Use parent address if available
        state: parentStateId || subPlace.state, // Use parent state if available
      },
    });
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

    const updatedPlace = await Place.findByIdAndUpdate(placeId, updatedData, {
      new: true,
    });

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

exports.getImage = async (req, res) => {
  try {
    const { placeName, fileName } = req.query;

    if (!placeName || !fileName) {
      return res
        .status(400)
        .json({ message: "Both placeName and fileName are required." });
    }

    const imagePath = path.join(
      UPLOADS_ROOT,
      placeName.replace(/ /g, "_"),
      fileName
    );

    // Check if the file exists
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ message: "Image not found." });
    }

    // Set headers and stream the file
    res.setHeader("Content-Type", "image/jpeg"); // Adjust content type if necessary
    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
