import React from "react";

const Step2 = ({ formData, onFormDataChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="container">
      <div className="row">
        {/* Enable Icons */}
        <div className="col-md-6 mb-3">
          <label htmlFor="enableIcons" className="form-label">
            Enable Icons
          </label>
          <select
            id="enableIcons"
            name="enableIcons"
            value={formData.enableIcons}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>

        {/* Itinerary Popular */}
        <div className="col-md-6 mb-3">
          <label htmlFor="itPopular" className="form-label">
            Itinerary Popular
          </label>
          <select
            id="itPopular"
            name="itPopular"
            value={formData.itPopular}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>

        {/* Itinerary Top */}
        <div className="col-md-6 mb-3">
          <label htmlFor="itTop" className="form-label">
            Itinerary Top
          </label>
          <select
            id="itTop"
            name="itTop"
            value={formData.itTop}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>

        {/* Itinerary Tour Plan */}
        <div className="col-md-6 mb-3">
          <label htmlFor="itTourPlan" className="form-label">
            Itinerary Tour Plan
          </label>
          <select
            id="itTourPlan"
            name="itTourPlan"
            value={formData.itTourPlan}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="N">No</option>
            <option value="Y">Yes</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Step2;
