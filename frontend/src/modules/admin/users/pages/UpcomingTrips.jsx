import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
  Stack,
  Card,
  Badge,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import axios from "axios"; // You'll use axios to make the API call
import{fetchAllBookingsForUpcomingTrips} from "../../services/ApiService";

// const generateImageUrl = (imagePath) => {
//   if (!imagePath) return "placeholder.jpg";
//   const parts = imagePath.split("\\");
//   const tourCode = parts[0]?.toLowerCase() || "";
//   const fileName = parts[1] || "";
//   return `http://localhost:3000/api/tour-plans/get-tour-plan-image?tourCode=${encodeURIComponent(
//     tourCode
//   )}&fileName=${encodeURIComponent(fileName)}`;
// };

const formatDate = (date) => {
  // Format the date using JavaScript's Date object and toLocaleDateString
  const options = { day: "numeric", month: "short" };
  return new Date(date).toLocaleDateString("en-GB", options); // Customize locale if needed
};

const CalendarTrips = () => {
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(false);


  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const VITE_GET_IMAGE_FOR_TOUR_PLAN = import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN.startsWith(
    "http"
  )
    ? import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN}`;

  const generateImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg";

    const [tourCode, fileName] = imagePath.split("\\");

    return `${VITE_GET_IMAGE_FOR_TOUR_PLAN}?tourCode=${encodeURIComponent(
      tourCode?.toLowerCase() || ""
    )}&fileName=${encodeURIComponent(fileName || "")}`;
  };
  // Fetch trips based on the current month
  const fetchTrips = async () => {
    try {
      setLoading(true);

      // Call your API here with the filters
      const response = await fetchAllBookingsForUpcomingTrips();

      setFilteredTrips(response.data.bookings); // Assuming 'bookings' is returned from your API
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips(); // Call API on component mount
  }, []);

  return (
    <Box sx={{ padding: 3, display: "flex", flexDirection: "column", gap: 3 }} className="shadow-lg rounded-4">
      {/* Upcoming Trips Section */}
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="mt-3 mb-3">
            <h4 style={{ color: "#ef156c" }}>Upcoming Trips</h4>
          </div>
        </Box>
        <Divider sx={{ marginY: 2 }} />
        <Box
          sx={{
            height: "50vh", // Fixed height of 50vh
            overflowY: "auto", // Scroll when content overflows
          }}
        >
          <Stack spacing={2}>
            {loading ? (
              <Typography variant="body2" color="textSecondary">
                Loading trips...
              </Typography>
            ) : filteredTrips.length > 0 ? (
              filteredTrips.map((trip) => {
                const currentDate = new Date();
                const tripDate = new Date(trip.date);
                const isFutureDate = tripDate > currentDate; // Check if the trip is in the future

                return (
                  <Card
                    key={trip._id}
                    sx={{
                      display: "flex",
                      gap: 2,
                      padding: 2,
                      borderRadius: "8px",
                      backgroundColor: "#f5f5f5",
                    }}
                  >
                    <Box
                      component="img"
                      src={generateImageUrl(trip.packageId.images[0])}
                      alt={trip.packageId.location}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: "8px",
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        maxWidth: "20vh", // Minimum width of 30% of the viewport height
                        overflowX: "auto", // Allow horizontal scroll
                        whiteSpace: "nowrap", // Prevent text wrapping to ensure horizontal scroll
                      }}
                    >
                      <Typography variant="subtitle1">
                        {trip.packageId.title}
                      </Typography>
                      <Typography variant="body2">
                        {trip.packageId.location}
                      </Typography>
                      <Typography variant="body2">
                        <span style={{ color: "#ef156c" }}>
                          Trip Start Date:{" "}
                        </span>
                        <Badge
                          color={isFutureDate ? "success" : "warning"} // Change badge color based on the date
                          badgeContent={isFutureDate ? "Upcoming" : "Past"}
                          sx={{ fontSize: "14px", padding: "0 10px" }}
                        >
                          {formatDate(trip.date)}
                        </Badge>
                      </Typography>
                      <Stack direction="row" spacing={1} mt={1}>
                        <Typography variant="body2">
                          {trip.packageId.duration} Days (Duration)
                        </Typography>
                      </Stack>
                    </Box>
                  </Card>
                );
              })
            ) : (
              <Typography variant="body2" color="textSecondary">
                No trips for the selected date.
              </Typography>
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default CalendarTrips;
