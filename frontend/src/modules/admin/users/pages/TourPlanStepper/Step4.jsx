// 




import React, { useState } from "react";

const Step4 = ({ formData, onFormDataChange, cityOptions, fetchSubCities, subCityOptions }) => {
  const [newItinerary, setNewItinerary] = useState({
    day: "",
    title: "",
    activities: [""],
    city: "",
    places: [],
    startTime: "",
    endTime: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItinerary({ ...newItinerary, [name]: value });
  };

  const handleActivityChange = (index, value) => {
    const updatedActivities = [...newItinerary.activities];
    updatedActivities[index] = value;
    setNewItinerary({ ...newItinerary, activities: updatedActivities });
  };

  const handleAddActivity = () => {
    setNewItinerary({
      ...newItinerary,
      activities: [...newItinerary.activities, ""],
    });
  };

  const handleRemoveActivity = (index) => {
    const updatedActivities = newItinerary.activities.filter((_, i) => i !== index);
    setNewItinerary({ ...newItinerary, activities: updatedActivities });
  };

  const handleCityChange = async (e) => {
    const selectedCity = e.target.value;
    setNewItinerary({ ...newItinerary, city: selectedCity, places: [] });
    if (selectedCity) {
      try {
        await fetchSubCities(selectedCity); // Ensure sub-city fetching happens here
      } catch (error) {
        console.error("Error fetching sub-cities:", error);
      }
    }
  };

  const handleAddItinerary = () => {
    // Validate input before adding
    if (!newItinerary.day || !newItinerary.title || !newItinerary.city) {
      alert("Please complete all required fields.");
      return;
    }

    // Add new itinerary to formData
    onFormDataChange({
      itinerary: [...formData.itinerary, newItinerary],
    });

    // Reset new itinerary fields
    setNewItinerary({
      day: "",
      title: "",
      activities: [""],
      city: "",
      places: [],
      startTime: "",
      endTime: "",
    });
  };

  const handleRemoveItinerary = (index) => {
    const updatedItinerary = formData.itinerary.filter((_, i) => i !== index);
    onFormDataChange({ itinerary: updatedItinerary });
  };

  return (
    <div className="container">
      <div className="row">
        {/* Existing Itineraries */}
        <div className="col-md-12 mb-3">
          <h5>Existing Itineraries</h5>
          <ul className="list-group">
            {formData.itinerary.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                <div>
                  <strong>Day {item.day}:</strong> {item.title} in {item.city}
                </div>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItinerary(index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Add New Itinerary */}
        <div className="col-md-12">
          <h5>Add New Itinerary</h5>

          <div className="mb-3">
            <label htmlFor="day" className="form-label">Day</label>
            <input
              type="number"
              name="day"
              value={newItinerary.day}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter day"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input
              type="text"
              name="title"
              value={newItinerary.title}
              onChange={handleInputChange}
              className="form-control"
              placeholder="Enter title"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="activities" className="form-label">Activities</label>
            {newItinerary.activities.map((activity, index) => (
              <div key={index} className="input-group mb-2">
                <input
                  type="text"
                  value={activity}
                  onChange={(e) => handleActivityChange(index, e.target.value)}
                  className="form-control"
                  placeholder="Enter activity"
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveActivity(index)}
                >
                  Remove
                </button>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleAddActivity}>
              Add Activity
            </button>
          </div>

          <div className="mb-3">
            <label htmlFor="city" className="form-label">City</label>
            <select
              name="city"
              value={newItinerary.city}
              onChange={handleCityChange}
              className="form-select"
            >
              <option value="">-- Select a City --</option>
              {cityOptions?.map((city) => (
                <option key={city._id} value={city.cityName}>
                  {city.cityName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="places" className="form-label">Places</label>
            <select
              name="places"
              value={newItinerary.places}
              onChange={(e) =>
                setNewItinerary({
                  ...newItinerary,
                  places: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
              className="form-select"
              multiple
            >
              {subCityOptions?.map((subCity) => (
                <option key={subCity._id} value={subCity._id}>
                  {subCity.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="startTime" className="form-label">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={newItinerary.startTime}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="endTime" className="form-label">End Time</label>
            <input
              type="time"
              name="endTime"
              value={newItinerary.endTime}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddItinerary}
          >
            Add Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
