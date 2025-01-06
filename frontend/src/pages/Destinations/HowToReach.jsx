import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBus, faTrain, faPlane } from "@fortawesome/free-solid-svg-icons";

const HowToReach = ({ transportData }) => {
  const [selectedMode, setSelectedMode] = useState("all");

  // Helper function to format duration
  const formatDuration = (duration) => {
    if (!duration || !duration.includes("-")) return "N/A";
    const [hours, minutes] = duration.split("-").map(Number);
    return `${hours || 0} H ${minutes || 0} M`;
  };

  // Filter data based on the selected transport mode
  const filteredData =
    selectedMode === "all"
      ? transportData
      : transportData.filter((item) => item.mode === selectedMode);

  const renderTable = (data, mode) => {
    if (data.length === 0) return <p>No data available for {mode}.</p>;

    return (
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Distance (Kms)</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.from}</td>
              <td>{item.end}</td>
              <td>{item.distance} km</td>
              <td>{formatDuration(item.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="how-to-reach-section">
      <h5>How to Reach</h5>

      {/* Transport Mode Tabs */}
      <div className="transport-tabs d-flex justify-content-center mb-4">
        <button
          className={`btn me-2 ${
            selectedMode === "all" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedMode("all")}
          style={{
            color: selectedMode === "all" ? "#fff" : "#ef156c",
            backgroundColor: selectedMode === "all" ? "#ef156c" : "transparent",
            borderColor: "#ef156c",
          }}
        >
          All
        </button>
        <button
          className={`btn me-2 ${
            selectedMode === "bus" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedMode("bus")}
          style={{
            color: selectedMode === "bus" ? "#fff" : "#ef156c",
            backgroundColor:
              selectedMode === "bus" ? "#ef156c" : "transparent",
            borderColor: "#ef156c",
          }}
        >
          <FontAwesomeIcon
            icon={faBus}
            className="me-2"
            style={{ color: selectedMode === "bus" ? "#fff" : "#ef156c" }}
          />
          Bus
        </button>
        <button
          className={`btn me-2 ${
            selectedMode === "train" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedMode("train")}
          style={{
            color: selectedMode === "train" ? "#fff" : "#ef156c",
            backgroundColor:
              selectedMode === "train" ? "#ef156c" : "transparent",
            borderColor: "#ef156c",
          }}
        >
          <FontAwesomeIcon
            icon={faTrain}
            className="me-2"
            style={{ color: selectedMode === "train" ? "#fff" : "#ef156c" }}
          />
          Train
        </button>
        <button
          className={`btn ${
            selectedMode === "airport" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedMode("airport")}
          style={{
            color: selectedMode === "airport" ? "#fff" : "#ef156c",
            backgroundColor:
              selectedMode === "airport" ? "#ef156c" : "transparent",
            borderColor: "#ef156c",
          }}
        >
          <FontAwesomeIcon
            icon={faPlane}
            className="me-2"
            style={{ color: selectedMode === "airport" ? "#fff" : "#ef156c" }}
          />
          Flight
        </button>
      </div>

      {/* Render Tables for Each Mode */}
      {selectedMode === "all" && (
        <div>
          <h6>
            <FontAwesomeIcon icon={faBus} className="me-2" style={{ color: "#ef156c" }} />
            By Bus
          </h6>
          {renderTable(
            transportData.filter((item) => item.mode === "bus"),
            "Bus"
          )}

          <h6>
            <FontAwesomeIcon icon={faTrain} className="me-2" style={{ color: "#ef156c" }} />
            By Train
          </h6>
          {renderTable(
            transportData.filter((item) => item.mode === "train"),
            "Train"
          )}

          <h6>
            <FontAwesomeIcon icon={faPlane} className="me-2" style={{ color: "#ef156c" }} />
            By Flight
          </h6>
          {renderTable(
            transportData.filter((item) => item.mode === "airport"),
            "Flight"
          )}
        </div>
      )}

      {/* Render Filtered Table */}
      {selectedMode !== "all" && renderTable(filteredData, selectedMode)}
    </div>
  );
};

export default HowToReach;
