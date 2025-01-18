import React from "react";

const Step1 = ({ 
  formData, 
  onFormDataChange, 
  addressOptions, 
  startPlaceOptions, 
  endPlaceOptions 
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    
    onFormDataChange({ [name]: value });
  };

  return (
    <div className="container">
      <div className="row">
        {/* Tour Code */}
        <div className="col-md-6 mb-3">
          <label htmlFor="tourCode" className="form-label">
            Tour Code
          </label>
          <input
            type="text"
            id="tourCode"
            name="tourCode"
            value={formData.tourCode}
            onChange={handleChange}
            className="form-control"
            placeholder="Ex: State city number TNCHE001"
            required
          />
        </div>

        {/* Title */}
        <div className="col-md-6 mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter title"
            required
          />
        </div>

        {/* Itinerary Summary Title */}
        <div className="col-md-12 mb-3">
          <label htmlFor="itSummaryTitle" className="form-label">
            Itinerary Summary Title
          </label>
          <input
            type="text"
            id="itSummaryTitle"
            name="itSummaryTitle"
            value={formData.itSummaryTitle}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter itinerary summary title"
            required
          />
        </div>

        {/* Address ID */}
        <div className="col-md-6 mb-3">
          <label htmlFor="addressId" className="form-label">
            Address
          </label>
          <select
            id="addressId"
            name="addressId"
            value={formData.addressId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select address</option>
            {addressOptions.map((address) => (
              <option key={address._id} value={address._id}>
                {address.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Start Place */}
        <div className="col-md-6 mb-3">
          <label htmlFor="startPlace" className="form-label">
            Start Place
          </label>
          <select
            id="startPlace"
            name="startPlace"
            value={formData.startPlace}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select start place</option>
            {startPlaceOptions.map((place) => (
              <option key={place._id} value={place._id}>
                {place.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* End Place */}
        <div className="col-md-6 mb-3">
          <label htmlFor="endPlace" className="form-label">
            End Place
          </label>
          <select
            id="endPlace"
            name="endPlace"
            value={formData.endPlace}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select end place</option>
            {endPlaceOptions.map((place) => (
              <option key={place._id} value={place._id}>
                {place.cityName}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="col-md-6 mb-3">
          <label htmlFor="duration" className="form-label">
            Duration
          </label>
          <input
            type="text"
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter duration"
            required
          />
        </div>

        {/* Base Fare */}
        <div className="col-md-6 mb-3">
          <label htmlFor="baseFare" className="form-label">
            Base Fare
          </label>
          <input
            type="number"
            id="baseFare"
            name="baseFare"
            value={formData.baseFare}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter base fare"
            required
          />
        </div>

        {/* Original Fare */}
        <div className="col-md-6 mb-3">
          <label htmlFor="origFare" className="form-label">
            Original Fare
          </label>
          <input
            type="number"
            id="origFare"
            name="origFare"
            value={formData.origFare}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter original fare"
            required
          />
        </div>

        {/* Tour Type */}
        <div className="col-md-6 mb-3">
          <label htmlFor="tourType" className="form-label">
            Tour Type
          </label>
          <select
            id="tourType"
            name="tourType"
            value={formData.tourType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select tour type</option>
            <option value="D">Domestic</option>
            <option value="I">International</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Step1;
