const TourPlan = require("../Models/tourPlanModel");
const fs = require("fs-extra");
const path = require("path");
const Booking = require("../Models/bookingModel");
const Review = require("../Models/reviewModel");
const Address = require("../Models/addressModel");
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "tourPlans");

// Helper function: Create dynamic folder for a tour plan
const createTourPlanFolder = async (tourCode) => {
  const folder = path.join(UPLOADS_ROOT, tourCode);
  await fs.ensureDir(folder);
  return folder;
};

// 1. Create a new tour plan
exports.createTourPlan = async (req, res) => {
  try {
    const {
      tourCode,
      title,
      itSummaryTitle,
      addressId,
      startPlace,
      endPlace,
      duration,
      enableIcon,
      baseFare,
      origFare,
      tourType,
      itPopular,
      itTop,
      itTourPlan,
      // primeDestinations,
      itinerary,
      inclusions,
      exclusions,
      optional,
      themeId,
      // operator,
    } = req.body;

    // Create folder dynamically for the tour plan
    const tourPlanFolder = await createTourPlanFolder(tourCode);

    // Rename and move uploaded files
    const images = [];
    if (req.files) {
      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(tourPlanFolder, newFileName);
        await fs.move(file.path, destinationPath);
        images.push(path.relative(UPLOADS_ROOT, destinationPath));
      }
    }

    const newTourPlan = new TourPlan({
      tourCode,
      title,
      itSummaryTitle,
      addressId,
      startPlace,
      endPlace,
      duration,
      enableIcon,
      baseFare,
      origFare,
      tourType,
      itPopular,
      itTop,
      itTourPlan,
      // primeDestinations: JSON.parse(primeDestinations),
      itinerary: JSON.parse(itinerary),
      inclusions: JSON.parse(inclusions),
      exclusions: JSON.parse(exclusions),
      optional: JSON.parse(optional),
      themeId: JSON.parse(themeId),
      // operator: JSON.parse(operator),
      images,
    });

    await newTourPlan.save();
    res
      .status(201)
      .json({
        message: "Tour plan created successfully",
        tourPlan: newTourPlan,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. Get all tour plans

exports.getAllTourPlans = async (req, res) => {
  try {
    // Step 1: Fetch all tour plans with necessary relationships populated
    const tourPlans = await TourPlan.find()
      .populate("addressId", "country state city images startingPrice") // Include startingPrice from address
      .populate("startPlace", "name description")
      .populate("endPlace", "name description")
      .populate("themeId", "name description")
      .lean(); // Fetch as plain objects for better performance

    // Step 2: Initialize the result structure
    const categories = {
      Top_destinations: [],
      Honeymoon: [],
      Wildlife: [],
      Hill_stations: [],
      Heritage: [],
      Pilgrimage: [],
      Beach: [],
    };

    const trendingCategories = [];

    // Step 3: Process each tour plan
    for (const plan of tourPlans) {
      const themes = plan.themeId.map((theme) => theme.name.toLowerCase());
      const address = plan.addressId;

      if (!address) continue; // Skip if address is missing

      let categoryKey = null;

      // Add to trending categories if address matches specific states
      if (["Rajasthan", "Andaman"].includes(address.state)) {
        let trendingState = trendingCategories.find(
          (trend) => trend.state === address.state
        );

        if (!trendingState) {
          trendingState = {
            state: address.state,
            startingPrice: address.startingPrice || plan.baseFare, // Use address startingPrice or fallback to plan baseFare
            image: address.images?.[0] || "",
            tourPlans: [],
          };
          trendingCategories.push(trendingState);
        }

        // Update state-level data
        trendingState.startingPrice = Math.min(
          trendingState.startingPrice,
          address.startingPrice || plan.baseFare
        );
        trendingState.tourPlans.push(plan);
      }

      // Determine the category
      if (themes.includes("top destinations") || plan.itTop === "Y") {
        categoryKey = "Top_destinations";
      } else if (themes.includes("honeymoon")) {
        categoryKey = "Honeymoon";
      } else if (themes.includes("wildlife")) {
        categoryKey = "Wildlife";
      } else if (themes.includes("hill stations")) {
        categoryKey = "Hill_stations";
      } else if (themes.includes("heritage")) {
        categoryKey = "Heritage";
      } else if (themes.includes("pilgrimage")) {
        categoryKey = "Pilgrimage";
      } else if (themes.includes("beach")) {
        categoryKey = "Beach";
      }

      if (!categoryKey) continue;

      // Find or initialize the state entry within the category
      let stateEntry = categories[categoryKey].find(
        (state) => state.state === address.state
      );

      if (!stateEntry) {
        stateEntry = {
          state: address.state, // State name
          startingPrice: address.startingPrice || plan.baseFare, // Use address startingPrice or fallback to plan baseFare
          image: address.images?.[0] || "", // Use the first image from the address or fallback
          tourPlanCount: 0, // Initialize tour plan count
          tourPlans: [], // Initialize an empty list for the plans
        };
        categories[categoryKey].push(stateEntry);
      }

      // Update the stateEntry with the new plan data
      stateEntry.startingPrice = Math.min(
        stateEntry.startingPrice,
        address.startingPrice || plan.baseFare
      );
      stateEntry.tourPlanCount += 1;
      stateEntry.tourPlans.push(plan);
    }

    // Step 4: Format the response
    const data = Object.keys(categories).map((category) => ({
      category,
      states: categories[category],
    }));

    // Step 5: Return the response
    res.json({
      message: "Tour plans categorized by category and state",
      trendingCategories,
      data,
    });
  } catch (error) {
    console.error("Error fetching tour plans:", error);
    res.status(500).json({ error: error.message });
  }
};

// 3. Get a single tour plan by ID
exports.getTourPlanById = async (req, res) => {
  try {
    const { tourPlanId } = req.params;
    const tourPlan = await TourPlan.findById(tourPlanId)
      .populate("addressId", "country state city")
      .populate("startPlace", "name description")
      .populate("endPlace", "name description")
      .populate("themeId", "name description")
      .populate("reviews", "tourRating recommend comments");

    if (!tourPlan) {
      return res.status(404).json({ message: "Tour plan not found" });
    }

    res.json({ message: "Tour plan retrieved successfully", tourPlan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTourPlansByState = async (req, res) => {
  try {
    const { stateName } = req.params;
    console.log("Fetching tour plans for state:", stateName); // Debugging log

    // Find the address with only the fields you need
    const address = await Address.findOne({
      state: new RegExp(`^${stateName}$`, "i"),
    }).select("country state city description images startingPrice");
    if (!address) {
      return res
        .status(404)
        .json({ message: "No address found for the given state" });
    }

    // Find tour plans for the matching addressId
    const tourPlans = await TourPlan.find({ addressId: address._id })
      .populate(
        "addressId",
        "country state city description images startingPrice"
      ) // Include additional fields in the populated addressId
      .populate("startPlace", "name description") // Limit populated startPlace fields
      .populate("endPlace", "name description") // Limit populated endPlace fields
      .populate("themeId", "name description"); // Limit populated themeId fields

    if (tourPlans.length === 0) {
      return res
        .status(404)
        .json({ message: "No tour plans found for the given state" });
    }

    res.json({ message: "Tour plans retrieved successfully", tourPlans });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.getTourPlanByTourCode = async (req, res) => {
  try {
    const { tourCode } = req.params;

    // Find the tour plan by tour code
    const tourPlan = await TourPlan.findOne({ tourCode })
      .populate(
        "addressId",
        "country state city description images startingPrice"
      ) // Populate address details
      .populate("startPlace", "country state city ") // Populate start place details
      .populate("endPlace", "country state city ") // Populate end place details
      .populate("themeId", "name description") // Populate theme details
      .populate({
        path: "reviews",
        populate: {
          path: "userId",
          select: "name email", // Populate user details
        },
        select: "tourRating recommend comments createdAt", // Select review fields
      });

    // Check if the tour plan exists
    if (!tourPlan) {
      return res.status(404).json({ message: "Tour plan not found" });
    }

    // Ensure `reviews` is always an array
    const result = {
      ...tourPlan.toObject(), // Convert Mongoose document to plain object
      reviews: tourPlan.reviews || [], // Default to an empty array if `reviews` is undefined
    };

    res.json({ message: "Tour plan retrieved successfully", tourPlan: result });
  } catch (error) {
    console.error("Error fetching tour plan:", error);
    res.status(500).json({ error: error.message });
  }
};

// 4. Update a tour plan by ID
exports.updateTourPlan = async (req, res) => {
  try {
    const { tourPlanId } = req.params;
    const updatedData = req.body;

    // Parse and validate array fields, including `images`
    const arrayFields = [
      "itinerary",
      "inclusion",
      "exclusion",
      "themeId",
      "optional",
      "images",
    ];
    for (const field of arrayFields) {
      if (updatedData[field] && typeof updatedData[field] === "string") {
        try {
          updatedData[field] = JSON.parse(updatedData[field]);
          if (!Array.isArray(updatedData[field])) {
            return res
              .status(400)
              .json({ error: `${field} should be an array` });
          }
        } catch (parseError) {
          return res.status(400).json({ error: `Invalid format for ${field}` });
        }
      }
    }

    // Handle file uploads for images
    if (req.files && req.files.length > 0) {
      const tourPlanFolder = await createTourPlanFolder(
        req.body.tourCode || "default"
      );
      const uploadedImages = [];
      for (const file of req.files) {
        const newFileName = `${Date.now()}-${file.originalname}`;
        const destinationPath = path.join(tourPlanFolder, newFileName);
        await fs.move(file.path, destinationPath);
        uploadedImages.push(path.relative(UPLOADS_ROOT, destinationPath));
      }

      // Combine existing images (if any) with newly uploaded images
      updatedData.images = (updatedData.images || []).concat(uploadedImages);
    }

    // Update the tour plan in the database
    const updatedTourPlan = await TourPlan.findByIdAndUpdate(
      tourPlanId,
      updatedData,
      { new: true }
    );

    if (!updatedTourPlan) {
      return res.status(404).json({ message: "Tour plan not found" });
    }

    res.json({
      message: "Tour plan updated successfully",
      tourPlan: updatedTourPlan,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. Delete a tour plan by ID
exports.deleteTourPlan = async (req, res) => {
  try {
    const { tourPlanId } = req.params;

    const deletedTourPlan = await TourPlan.findByIdAndDelete(tourPlanId);

    if (!deletedTourPlan) {
      return res.status(404).json({ message: "Tour plan not found" });
    }

    // Optionally delete the folder associated with this tour plan
    const tourPlanFolder = path.join(UPLOADS_ROOT, deletedTourPlan.tourCode);
    await fs.remove(tourPlanFolder);

    res.json({ message: "Tour plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. Serve an image
exports.getTourPlanImage = async (req, res) => {
  try {
    const { tourCode, fileName } = req.query;
    const filePath = path.join(UPLOADS_ROOT, tourCode, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
