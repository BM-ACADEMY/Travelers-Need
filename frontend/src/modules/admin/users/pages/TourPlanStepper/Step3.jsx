import React, { useState } from "react";

const Step3 = ({ formData, onFormDataChange, themeOptions }) => {
  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");
  const [newOptional, setNewOptional] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);

  const handleArrayChange = (field, value) => {
    onFormDataChange({ [field]: [...formData[field], value] });
  };

  const handleRemoveItem = (field, index) => {
    const updatedArray = formData[field].filter((_, i) => i !== index);
    onFormDataChange({ [field]: updatedArray });
  };

  const handleFileUpload = (e) => {
    console.log("handle file changes");
    
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(fileUrls);
    onFormDataChange({ images: [...formData.images, ...fileUrls] });
  };

  const handleThemeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    onFormDataChange({ themeId: selectedOptions });
  };

  return (
    <div className="container">
      <div className="row">
        {/* Inclusions */}
        <div className="col-md-12 mb-3">
          <label htmlFor="inclusions" className="form-label">Inclusions</label>
          <div className="input-group mb-2">
            <input
              type="text"
              id="inclusions"
              value={newInclusion}
              onChange={(e) => setNewInclusion(e.target.value)}
              className="form-control"
              placeholder="Add an inclusion"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (newInclusion) {
                  handleArrayChange("inclusions", newInclusion);
                  setNewInclusion("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul className="list-group">
            {formData.inclusions.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                {item}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem("inclusions", index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="col-md-12 mb-3">
          <label htmlFor="exclusions" className="form-label">Exclusions</label>
          <div className="input-group mb-2">
            <input
              type="text"
              id="exclusions"
              value={newExclusion}
              onChange={(e) => setNewExclusion(e.target.value)}
              className="form-control"
              placeholder="Add an exclusion"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (newExclusion) {
                  handleArrayChange("exclusions", newExclusion);
                  setNewExclusion("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul className="list-group">
            {formData.exclusions.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                {item}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem("exclusions", index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Optional */}
        <div className="col-md-12 mb-3">
          <label htmlFor="optional" className="form-label">Optional</label>
          <div className="input-group mb-2">
            <input
              type="text"
              id="optional"
              value={newOptional}
              onChange={(e) => setNewOptional(e.target.value)}
              className="form-control"
              placeholder="Add an optional"
            />
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                if (newOptional) {
                  handleArrayChange("optional", newOptional);
                  setNewOptional("");
                }
              }}
            >
              Add
            </button>
          </div>
          <ul className="list-group">
            {formData.optional.map((item, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between">
                {item}
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveItem("optional", index)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Theme ID */}
        <div className="col-md-12 mb-3">
          <label htmlFor="themeId" className="form-label">Theme ID</label>
          <select
            id="themeId"
            multiple
            value={formData.themeId}
            onChange={handleThemeChange}
            className="form-select"
          >
            {themeOptions.map((theme) => (
              <option key={theme._id} value={theme._id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div className="col-md-12 mb-3">
          <label htmlFor="images" className="form-label">Images</label>
          <input
            type="file"
            id="images"
            multiple
            onChange={handleFileUpload}
            className="form-control"
          />
          <div className="mt-3">
            {selectedImages.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Preview ${index}`}
                className="img-thumbnail me-2"
                style={{ width: "100px", height: "100px" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3;
