import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import "leaflet-fullscreen";
import L from "leaflet";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom Zoom Controls
const ZoomControl = () => {
  const map = useMap();

  const handleZoomIn = () => {
    map.zoomIn();
  };

  const handleZoomOut = () => {
    map.zoomOut();
  };

  useEffect(() => {
    L.control.fullscreen({ position: "topright" }).addTo(map); // Add Fullscreen Control
  }, [map]);

  return (
    <div
      style={{
        position: "absolute",
        bottom: "10px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      <button
        onClick={handleZoomIn}
        style={{
          display: "block",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "4px",
          marginBottom: "5px",
          cursor: "pointer",
        }}
      >
        +
      </button>
      <button
        onClick={handleZoomOut}
        style={{
          display: "block",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        −
      </button>
    </div>
  );
};

const createCustomIcon = (stateName, startingPrice) => {
  return L.divIcon({
    className: "custom-marker-label",
    html: `
      <div style="background: rgba(0,0,0,0.6); color: white; padding: 5px 10px; border-radius: 10px; font-size: 12px; text-align: center;">
        <strong>${stateName}</strong><br/>
        ₹${startingPrice}
      </div>
    `,
    iconSize: [80, 40],
    iconAnchor: [40, 20],
  });
};

const MapComponent = ({ locationDetails }) => {
  const centerPosition = [11.0168, 76.9558]; // Center of the map

  return (
    <MapContainer
      center={centerPosition}
      zoom={7}
      style={{ height: "100%", width: "100%" }}
    >
      {/* Add Tile Layer */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Add Zoom-In and Zoom-Out Controls */}
      <ZoomControl />

      {/* Add Markers with Labels */}
      {locationDetails.map((location, index) => (
        <Marker
          key={index}
          position={location.coordinates}
          icon={createCustomIcon(location.stateName, location.startingPrice)}
        >
          <Popup>
            <div style={{ textAlign: "center" }}>
              <h6 style={{ margin: "0" }}>{location.stateName}</h6>
              <p style={{ margin: "0", fontSize: "14px" }}>
                Starting from: <strong>₹{location.startingPrice}</strong>
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
