import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import L from "leaflet";
import "../components/MapComponent.css"; // Import your custom styles
import {fetchMapData} from "../modules/admin/services/ApiService";
// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Zoom Controls Component
const CustomZoomControl = () => {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();

  return (
    <div className="zoom-controls">
      <button className="zoom-button" onClick={handleZoomIn}>
        +
      </button>
      <button className="zoom-button" onClick={handleZoomOut}>
        −
      </button>
    </div>
  );
};

// Custom Fullscreen Control
const FullscreenControl = () => {
  const map = useMap();

  useEffect(() => {
    L.control.fullscreen({ position: "topright" }).addTo(map); // Add Fullscreen Control
  }, [map]);

  return null;
};

const createCustomIcon = (stateName, startingPrice) => {
  return L.divIcon({
    className: "custom-marker-label",
    html: `
      <div>
        <strong>${stateName}</strong><br/>
        ₹${startingPrice}
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 20],
  });
};

const MapComponent = () => {
  const [locationDetails, setLocationDetails] = useState([]); // State for API data
  const [loading, setLoading] = useState(true);
  const centerPosition = [11.0168, 76.9558]; // Center of the map
  // const Baseurl=import.meta.env.VITE_BASE_URL;
  // const getApi=import.meta.env.VITE_MAP_DATA_ENDPOINT;
//  const fullUrl = "http://localhost:3000/api/address/get-all-addresses";
  // Fetch data from the API using Axios
  useEffect(() => {
    const fetchData = async () => {
      try {
        
        const response = await fetchMapData();
        const data = response.data.addresses;

        // Transform data to match locationDetails structure
        const transformedData = data.map((address) => ({
          stateName: address.cityName,
          coordinates: address.coordinates,
          startingPrice: address.startingPrice,
        }));
        setLocationDetails(transformedData);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading map...</p>;
  }

  return (
    <MapContainer
      center={centerPosition}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
      zoomControl={false} // Disable default zoom control
    >
      {/* Add Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Add Custom Fullscreen Control */}
      <FullscreenControl />

      {/* Add Custom Zoom Controls */}
      <CustomZoomControl />

      {/* Add Markers with Labels */}
      {locationDetails.map((location, index) => (
        <Marker
          key={index}
          position={location.coordinates}
          icon={createCustomIcon(location.stateName, location.startingPrice)}
        >
          <Popup>
            <div>
              <h6>{location.stateName}</h6>
              <p>Starting from: <strong>₹{location.startingPrice}</strong></p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
