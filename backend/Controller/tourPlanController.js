const TourPlan = require("../Models/tourPlanModel");
const fs = require("fs-extra");
const path = require("path");
const Booking = require("../Models/bookingModel");
const Review = require("../Models/reviewModel");
const Place = require("../Models/placeModel");
const Address = require("../Models/addressModel");
const UPLOADS_ROOT = path.join(__dirname, "..", "uploads", "tourPlans");
const mongoose = require("mongoose");
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
      itinerary,
      inclusions,
      exclusions,
      optional,
      themeId,
      // operator,
    } = req.body;
    console.log(req.body);

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
    res.status(201).json({
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
      .populate("addressId", "country state city images startingPrice")
      .populate("startPlace", "name description")
      .populate("endPlace", "name description")
      .populate("themeId", "name description")
      .lean();

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
exports.getAllTourPlansForSearch = async (req, res) => {
  try {
    // Step 1: Fetch all tour plans with necessary relationships populated
    const tourPlans = await TourPlan.find()
      .populate(
        "addressId",
        "country state city images startingPrice description _id"
      ) // Include _id
      .populate("startPlace", "name description city state _id") // Include _id
      .lean(); // Fetch as plain objects for better performance

    // Step 2: Initialize the result structure for grouping
    const startPlaces = [];
    const destinations = [];
    const durations = new Set(); // Use a Set to avoid duplicates

    // Step 3: Process each tour plan
    for (const plan of tourPlans) {
      // Extract startPlace details
      if (plan.startPlace) {
        const startPlaceEntry = {
          _id: plan.startPlace._id || null, // Include _id
          name: plan.startPlace.name || plan.startPlace.city || "N/A",
          city: plan.startPlace.city || "N/A",
          state: plan.startPlace.state || "N/A",
          description: plan.startPlace.description || "",
        };

        // Add to startPlaces if it doesn't already exist
        if (
          !startPlaces.some(
            (place) => place._id === startPlaceEntry._id // Use _id for uniqueness
          )
        ) {
          startPlaces.push(startPlaceEntry);
        }
      }

      // Extract destination details from addressId
      if (plan.addressId) {
        const destinationEntry = {
          _id: plan.addressId._id || null, // Include _id
          name: plan.addressId.city || "N/A",
          state: plan.addressId.state || "N/A",
          country: plan.addressId.country || "N/A",
          description: plan.addressId.description || "",
          images: plan.addressId.images || [], // Include destination images if available
          startingPrice: plan.addressId.startingPrice || 0, // Include starting price if available
        };

        // Add to destinations if it doesn't already exist
        if (
          !destinations.some(
            (dest) => dest._id === destinationEntry._id // Use _id for uniqueness
          )
        ) {
          destinations.push(destinationEntry);
        }
      }

      // Extract duration and format it
      if (plan.duration) {
        const days = parseInt(plan.duration, 10); // Convert to number
        const nights = days > 1 ? days - 1 : 0; // Calculate nights
        const formattedDuration = `${days} Days / ${nights} Night${
          nights > 1 ? "s" : ""
        }`; // Format duration
        durations.add(days); // Add to Set to avoid duplicates
      }
    }

    // Convert Set to Array
    const formattedDurations = Array.from(durations);

    // Step 4: Return the grouped data
    res.json({
      message: "Grouped data fetched successfully",
      startPlaces,
      destinations,
      durations: formattedDurations, // Return formatted durations
    });
  } catch (error) {
    console.error("Error fetching tour plans:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.getTourPlanByStateSearch = async (req, res) => {
  try {
    const { stateName } = req.params;

    console.log("Fetching tour plans for state:", stateName);

    // Step 1: Fetch all tour plans filtered by the given stateName
    const tourPlans = await TourPlan.find()
      .populate({
        path: "addressId",
        match: { state: new RegExp(`^${stateName}$`, "i") }, // Match stateName case-insensitively
        select: "country state city images startingPrice description _id",
      })
      .populate("startPlace", "name description city state _id") // Include startPlace details
      .lean(); // Fetch as plain objects for better performance

    // Filter out tour plans where addressId does not match the stateName
    const filteredPlans = tourPlans.filter((plan) => plan.addressId);

    // Step 2: Initialize the result structure for grouping
    const startPlaces = [];
    const destinations = [];
    const durations = new Set(); // Use a Set to avoid duplicates

    // Step 3: Process each filtered tour plan
    for (const plan of filteredPlans) {
      // Extract startPlace details
      if (plan.startPlace) {
        const startPlaceEntry = {
          _id: plan.startPlace._id || null,
          name: plan.startPlace.name || plan.startPlace.city || "N/A",
          city: plan.startPlace.city || "N/A",
          state: plan.startPlace.state || "N/A",
          description: plan.startPlace.description || "",
        };

        // Add to startPlaces if it doesn't already exist
        if (!startPlaces.some((place) => place._id === startPlaceEntry._id)) {
          startPlaces.push(startPlaceEntry);
        }
      }

      // Extract destination details from addressId
      if (plan.addressId) {
        const destinationEntry = {
          _id: plan.addressId._id || null,
          name: plan.addressId.city || "N/A",
          state: plan.addressId.state || "N/A",
          country: plan.addressId.country || "N/A",
          description: plan.addressId.description || "",
          images: plan.addressId.images || [],
          startingPrice: plan.addressId.startingPrice || 0,
        };

        // Add to destinations if it doesn't already exist
        if (!destinations.some((dest) => dest._id === destinationEntry._id)) {
          destinations.push(destinationEntry);
        }
      }

      // Extract duration and format it
      if (plan.duration) {
        const days = parseInt(plan.duration, 10);
        const nights = days > 1 ? days - 1 : 0;
        const formattedDuration = `${days} Days / ${nights} Night${
          nights > 1 ? "s" : ""
        }`;
        durations.add(days); // Add formatted duration
      }
    }

    // Convert Set to Array
    const formattedDurations = Array.from(durations);

    // Step 4: Return the grouped data
    res.json({
      message: `Grouped data for state '${stateName}' fetched successfully`,
      startPlaces,
      destinations,
      durations: formattedDurations,
    });
  } catch (error) {
    console.error("Error fetching tour plans for state:", error);
    res.status(500).json({ error: error.message });
  }
};
// exports.getTourPlansByState = async (req, res) => {
//   try {
//     const { stateName } = req.params;

//     console.log("Fetching tour plans for state:", stateName);

//     // Find the address with the matching stateName
//     const address = await Address.findOne({
//       state: new RegExp(`^${stateName}$`, "i"),
//     }).select("country state city description images startingPrice");

//     if (!address) {
//       return res
//         .status(404)
//         .json({ message: "No address found for the given state" });
//     }

//     // Fetch tour plans associated with the state
//     const tourPlans = await TourPlan.find({ addressId: address._id })
//       .populate(
//         "addressId",
//         "country state city description images startingPrice"
//       )
//       .populate("startPlace", "name description")
//       .lean(); // Fetch plain objects for easier manipulation

//     if (tourPlans.length === 0) {
//       return res.json({
//         message: "No tour plans found for the given state",
//         address,
//       });
//     }

//     // Return data without reviews
//     res.json({
//       message: "Tour plans retrieved successfully",
//       address,
//       tourPlans,
//     });
//   } catch (error) {
//     console.error("Error fetching tour plans by state:", error);
//     res.status(500).json({ error: error.message });
//   }
// };


// exports.getTourPlansByState = async (req, res) => {
//   try {
//     const { stateName } = req.params;

//     console.log("Fetching tour plans for city or state:", stateName);

//     // Find the address first by city, then by state
//     const address = await Address.findOne({
//       $or: [
//         { city: new RegExp(`^${stateName}$`, "i") }, // Match by city
//         { state: new RegExp(`^${stateName}$`, "i") }, // Match by state if city doesn't match
//       ],
//     }).select("country state city description images startingPrice");

//     if (!address) {
//       return res
//         .send()
//         .json({ message: "No address found for the given city or state" });
//     }

//     // Initialize the base query
//     const baseQuery = { addressId: address._id };

//     // Only add conditions for `from` and `duration` if they exist in req.query
//     if (req.query.from && mongoose.Types.ObjectId.isValid(req.query.from)) {
//       baseQuery.startPlace = req.query.from; // Add startPlace condition
//     }

//     if (req.query.duration) {
//       const durationValue = parseInt(req.query.duration, 10);
//       if (!isNaN(durationValue)) {
//         baseQuery.duration = durationValue; // Add duration condition
//       }
//     }

//     let tourPlans;

//     // If the stateName matches the city, fetch all tour plans
//     if (address.city.toLowerCase() === stateName.toLowerCase()) {
//       console.log("Fetching tour plans for city:", address.city);

//       tourPlans = await TourPlan.find(baseQuery)
//         .populate(
//           "addressId",
//           "country state city description images startingPrice"
//         )
//         .populate("startPlace", "name description")
//         .lean();

//       if (tourPlans.length === 0) {
//         return res.json({
//           message: "No tour plans found for the given city",
//           address,
//         });
//       }
//     }
//     // If the stateName matches the state, check themeId and fetch accordingly
//     else if (address.state.toLowerCase() === stateName.toLowerCase()) {
//       console.log("Fetching tour plans for state:", address.state);

//       tourPlans = await TourPlan.find({
//         ...baseQuery,
//         $or: [
//           { themeId: { $type: "string", $eq: "" } }, // Check if themeId is an empty string
//           { themeId: { $type: "array", $size: 0 } }, // Check if themeId is an empty array
//         ],
//       })
//         .populate(
//           "addressId",
//           "country state city description images startingPrice"
//         )
//         .populate("startPlace", "name description")
//         .lean();

//       if (tourPlans.length === 0) {
//         return res.json({
//           message: "No tour plans found for the given state with empty themeId",
//           address,
//         });
//       }
//     }

//     // Return data with the matching address and tour plans
//     res.json({
//       message: "Tour plans retrieved successfully",
//       address,
//       tourPlans,
//     });
//   } catch (error) {
//     console.error("Error fetching tour plans by city or state:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

exports.getTourPlansByState = async (req, res) => {
  try {
    const { stateName } = req.params;

    console.log("Fetching tour plans for city or state:", stateName);

    const address = await Address.findOne({
      $or: [
        { city: new RegExp(`^${stateName}$`, "i") }, // Match by city
        { state: new RegExp(`^${stateName}$`, "i") }, // Match by state if city doesn't match
      ],
    }).select("country state city description images startingPrice");

    if (!address) {
      return res.status(404).json({
        message: "No address found for the given city or state",
      });
    }

    const baseQuery = { addressId: address._id };

    if (req.query.from && mongoose.Types.ObjectId.isValid(req.query.from)) {
      baseQuery.startPlace = req.query.from;
    }

    if (req.query.duration) {
      const durationValue = parseInt(req.query.duration, 10);
      if (!isNaN(durationValue)) {
        baseQuery.duration = durationValue;
      }
    }

    let tourPlans;

    if (address.city.toLowerCase() === stateName.toLowerCase()) {
      console.log("Fetching tour plans for city:", address.city);

      tourPlans = await TourPlan.find(baseQuery)
        .populate("addressId", "country state city description images startingPrice")
        .populate("startPlace", "name description")
        .lean();

      if (tourPlans.length === 0) {
        return res.json({
          message: "No tour plans found for the given city",
          address,
        });
      }
    } else if (address.state.toLowerCase() === stateName.toLowerCase()) {
      console.log("Fetching tour plans for state:", address.state);

      tourPlans = await TourPlan.find({
        ...baseQuery,
        $or: [
          { themeId: { $exists: true, $size: 0 } }, // Empty array
          { themeId: { $exists: false } },         // Not defined
        ],
      })
        .populate("addressId", "country state city description images startingPrice")
        .populate("startPlace", "name description")
        .lean();

      if (tourPlans.length === 0) {
        return res.json({
          message: "No tour plans found for the given state with empty themeId",
          address,
        });
      }
    }

    res.json({
      message: "Tour plans retrieved successfully",
      address,
      tourPlans,
    });
  } catch (error) {
    console.error("Error fetching tour plans by city or state:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getReviewsByState = async (req, res) => {
  try {
    const { stateName } = req.params;
    const { page = 1, limit = 5 } = req.query;

    console.log("Fetching reviews for state:", stateName);

    // Find the address with the matching stateName
    const address = await Address.findOne({
      state: new RegExp(`^${stateName}$`, "i"),
    }).select("_id state");

    if (!address) {
      return res
        .status(404)
        .json({ message: "No address found for the given state" });
    }

    // Fetch tour plans associated with this state
    const tourPlans = await TourPlan.find({ addressId: address._id }).lean();

    if (tourPlans.length === 0) {
      return res.json({
        message: `No tour plans found for the state: ${stateName}`,
        reviews: [],
        tourCount: 0,
        averageTourRating: 0,
      });
    }

    // Collect tourPlan IDs
    const tourPlanIds = tourPlans.map((plan) => plan._id);

    // Collect startPlace IDs
    const startPlaceIds = tourPlans
      .map((plan) => plan.startPlace)
      .filter((id) => id); // Remove null or undefined values

    // Fetch startPlace cities from Address collection
    const startPlaces = await Address.find({ _id: { $in: startPlaceIds } })
      .select("_id city")
      .lean();

    // Create a map of startPlace ID to city
    const startPlaceCityMap = startPlaces.reduce((acc, place) => {
      acc[place._id.toString()] = place.city;
      return acc;
    }, {});

    // Fetch bookings linked to these tour plans
    const bookings = await Booking.find({ packageId: { $in: tourPlanIds } })
      .select("orderId packageId")
      .lean();

    const bookingIds = bookings.map((booking) => booking.orderId);

    // Fetch reviews only for the bookings linked to these tour plans
    const skip = (page - 1) * limit;
    const reviews = await Review.find({ bookingId: { $in: bookingIds } })
      .select("tourRating comments name email createdAt userId bookingId")
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Calculate total reviews and average rating
    const allReviews = await Review.find({ bookingId: { $in: bookingIds } })
      .select("tourRating")
      .lean();
    const totalRating = allReviews.reduce(
      (sum, review) => sum + review.tourRating,
      0
    );
    const averageTourRating =
      allReviews.length > 0 ? totalRating / allReviews.length : 0;

    // Return reviews formatted for the state
    const formattedReviews = reviews.map((review) => {
      // Find the tourPlan associated with the review
      const tourPlan = tourPlans.find(
        (plan) =>
          plan._id.toString() ===
          bookings
            .find((b) => b.orderId === review.bookingId)
            ?.packageId.toString()
      );

      // Get the city of the startPlace from the map
      const startPlaceCity =
        tourPlan && startPlaceCityMap[tourPlan.startPlace?.toString()]
          ? startPlaceCityMap[tourPlan.startPlace.toString()]
          : "Unknown";

      return {
        rating: review.tourRating,
        comment: review.comments,
        name: review.name,
        email: review.email,
        date: review.createdAt,
        user: review.userId,
        stateName: stateName, // State name from the request
        startPlace: startPlaceCity, // City of the startPlace
      };
    });

    res.json({
      message: "Reviews retrieved successfully",
      stateName: stateName,
      reviews: formattedReviews,
      tourCount: allReviews.length, // Total tours linked to this state
      averageTourRating: averageTourRating.toFixed(2),
      pagination: {
        currentPage: Number(page),
        totalReviews: allReviews.length,
        totalPages: Math.ceil(allReviews.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews by state:", error);
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
exports.getItineraryByTourCode = async (req, res) => {
  try {
    const { tourCode } = req.params;

    // Find the tour plan by tour code
    const tourPlan = await TourPlan.findOne({ tourCode })
      .populate(
        "addressId",
        "country state city description images startingPrice"
      ) // Populate address details
      .populate("startPlace", "country state city") // Populate start place details
      .populate("endPlace", "country state city") // Populate end place details
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

    // Fetch details for places in the itinerary
    const itineraryWithPlaceDetails = await Promise.all(
      tourPlan.itinerary.map(async (dayPlan) => {
        const placesDetails = await Place.find({
          _id: { $in: dayPlan.places },
        }).select("name description location images"); // Select desired fields

        return {
          ...dayPlan.toObject(), // Convert dayPlan to plain object
          places: placesDetails, // Replace place IDs with their details
        };
      })
    );

    const result = {
      ...tourPlan.toObject(),
      itinerary: itineraryWithPlaceDetails, // Updated itinerary with place details
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

    console.log(req.body, "update");
    console.log(req.files, "file");
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

    res.status(201).json({
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

    res.status(201).json({ message: "Tour plan deleted successfully" });
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

exports.getTourPlansByCity = async (req, res) => {
  try {
    const { cityName, title = "" } = req.query;
    const { page = 1, limit = 10 } = req.query; // Pagination parameters with default values

    console.log("Fetching tour plans for city:", cityName, "and title:", title);

    // Find the address with the matching cityName
    const address = await Address.findOne({
      city: new RegExp(`^${cityName}$`, "i"),
    }).select("country state city description images startingPrice");

    if (!address) {
      return res
        .status(404)
        .json({ message: "No address found for the given city" });
    }

    // Build the query
    const query = {
      addressId: address._id,
      title: new RegExp(title, "i"), // Case-insensitive search for the title
    };

    // Fetch paginated tour plans associated with the city and title
    const tourPlans = await TourPlan.find(query)
      .populate(
        "addressId",
        "country state city description images startingPrice"
      )
      .populate("startPlace", "name description")
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const totalCount = await TourPlan.countDocuments(query);

    if (tourPlans.length === 0) {
      return res.json({
        message: "No tour plans found for the given city and title",
        address,
      });
    }

    // Return data with pagination metadata
    res.status(201).json({
      message: "Tour plans retrieved successfully",
      address,
      tourPlans,
      pagination: {
        total: totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching tour plans by city:", error);
    res.status(500).json({ error: error.message });
  }
};
