// import React, { useEffect } from "react";
// import {
//   TextField,
//   Grid,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";

// const Step1 = ({
//   formData,
//   onFormDataChange,
//   stateOptions,
//   parentPlaceOptions,
//   subPlaceOptions,
//   placeType, // This determines whether it's 'city' or 'sub_place'
// }) => {
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     onFormDataChange({ [name]: value });
//   };

//   const handleCheckboxChange = (e) => {
//     const { name, checked } = e.target;
//     onFormDataChange({ [name]: checked ? "Y" : "N" });
//   };

//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files);
//     const fileURLs = files.map((file) => URL.createObjectURL(file));
//     onFormDataChange({ images: fileURLs });
//   };

//   // useEffect(() => {
//   //   // To prevent memory leaks, revoke object URLs when component unmounts
//   //   return () => {
//   //     formData.images.forEach((url) => URL.revokeObjectURL(url));
//   //   };
//   // }, [formData.images]);

//   return (
//     <Grid container spacing={2}>
//       {/* Common Fields */}
//       <Grid item xs={12}>
//         <TextField
//           label="Place Name"
//           fullWidth
//           name="name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <TextField
//           label="Description"
//           fullWidth
//           multiline
//           rows={4}
//           name="description"
//           value={formData.description}
//           onChange={handleChange}
//         />
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>Type</InputLabel>
//           <Select name="type" value={formData.type} onChange={handleChange}>
//             <MenuItem value="city">City</MenuItem>
//             <MenuItem value="sub_place">Sub Place</MenuItem>
//           </Select>
//         </FormControl>
//       </Grid>
//       <Grid item xs={12}>
//         <FormControl fullWidth>
//           <InputLabel>State</InputLabel>
//           <Select name="state" value={formData.state} onChange={handleChange}>
//             {stateOptions.map((option) => (
//               <MenuItem key={option._id} value={option._id}>
//                 {option.stateName}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Grid>

//       {/* Conditional Rendering for 'city' */}
//       {placeType === "city" && (
//         <>
//           <Grid item xs={12}>
//             <TextField
//               label="Best Time to Visit"
//               fullWidth
//               name="bestTimetoVisit"
//               value={formData.bestTimetoVisit}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Ideal Trip Duration"
//               fullWidth
//               name="idealTripDuration"
//               value={formData.idealTripDuration}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Place Title"
//               fullWidth
//               name="placeTitle"
//               value={formData.placeTitle}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="placePopular"
//                   checked={formData.placePopular === "Y"}
//                   onChange={handleCheckboxChange}
//                 />
//               }
//               label="Is Place Popular?"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="placeTop"
//                   checked={formData.placeTop === "Y"}
//                   onChange={handleCheckboxChange}
//                 />
//               }
//               label="Is Place a Top Destination?"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="mostPopular"
//                   checked={formData.mostPopular === "Y"}
//                   onChange={handleCheckboxChange}
//                 />
//               }
//               label="Is Place Most Popular?"
//             />
//           </Grid>
//         </>
//       )}

//       {/* Conditional Rendering for 'sub_place' */}
//       {placeType === "sub_place" && (
//         <>
//           <Grid item xs={12}>
//             <FormControl fullWidth>
//               <InputLabel>Parent Place</InputLabel>
//               <Select
//                 name="parentPlace"
//                 value={formData.parentPlace}
//                 onChange={handleChange}
//               >
//                 {parentPlaceOptions.map((option) => (
//                   <MenuItem key={option._id} value={option._id}>
//                     {option.cityName}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Distance"
//               fullWidth
//               name="distance"
//               value={formData.distance}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Place Location"
//               fullWidth
//               name="placeLocation"
//               value={formData.placeLocation}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Travel Tips"
//               fullWidth
//               multiline
//               rows={4}
//               name="travelTipes"
//               value={formData.travelTipes}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Transport Options"
//               fullWidth
//               name="transportOption"
//               value={formData.transportOption}
//               onChange={handleChange}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Ideal Trip Duration"
//               fullWidth
//               name="idealTripDuration"
//               value={formData.idealTripDuration}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Place Title"
//               fullWidth
//               name="placeTitle"
//               value={formData.placeTitle}
//               onChange={handleChange}
//               required
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="placeTop"
//                   checked={formData.placeTop === "Y"}
//                   onChange={handleCheckboxChange}
//                 />
//               }
//               label="Is Place a Top Destination?"
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   name="mustVisit"
//                   checked={formData.mustVisit === "Y"}
//                   onChange={handleCheckboxChange}
//                 />
//               }
//               label="Is Place a Must Visit?"
//             />
//           </Grid>
//         </>
//       )}

//       {/* Common Field for Image Upload */}
//       <Grid item xs={12}>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleFileChange}
//           style={{ display: "block", margin: "10px 0" }}
//         />
//         <div>
//           {/* Display existing image file names */}
//           {formData.images.length > 0 &&
//             formData.images.map((imagePath, index) => {
//               // If the image is a URL (not a File object), extract and display the file name
//               const fileName =
//                 typeof imagePath === "string"
//                   ? imagePath.split("\\").pop().split("/").pop() // For image URLs
//                   : imagePath.name || "Unknown Image"; // For File objects (e.g., from the file input)
//               return (
//                 <div key={index} style={{ marginBottom: "10px" }}>
//                   <span>{fileName}</span> {/* Display the file name */}
//                 </div>
//               );
//             })}
//         </div>
//       </Grid>
//     </Grid>
//   );
// };

// export default Step1;

import React, { useEffect,useState } from "react";

const Step1 = ({
  formData,
  onFormDataChange,
  stateOptions,
  parentPlaceOptions,
  subPlaceOptions,
  placeType, // This determines whether it's 'city' or 'sub_place'
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormDataChange({ [name]: value });
  };
  const [selectedImages, setSelectedImages] = useState([]);
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    onFormDataChange({ [name]: checked ? "Y" : "N" });
  };
  const handleFileUpload = (e) => {
    console.log("handle file changes");
    
    const files = Array.from(e.target.files);
    const fileUrls = files.map((file) => URL.createObjectURL(file));
    setSelectedImages(fileUrls);
    onFormDataChange({ images: [...formData.images, ...fileUrls] });
  };

  return (
    <form>
      <div className="mb-3">
        {/* Common Fields */}
        <label htmlFor="name" className="form-label">
          Place Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          placeholder="Sri Meenakshi Sundareswarar Temple"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          className="form-control"
          id="description"
          name="description"
          placeholder="Chennai, Madurai, Trichy, Mahabalipuram, Thanjavur, Vellore, Kanyakumari, Rameshwaram, and Kanchipuram are the top Tamilnadu Tourist Places. Besides, pristine beauty of hill stations like Ooty and Kodaikanal leaves the visitors mesmerized with its irresistible charm."
          value={formData.description}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <div className="mb-3">
        <label htmlFor="type" className="form-label">
          Type
        </label>
        <select
          className="form-select"
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
        >
          <option value="city">City</option>
          <option value="sub_place">Sub Place</option>
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="state" className="form-label">
          State
        </label>
        <select
          className="form-select"
          id="state"
          name="state"
          value={formData.state}
          onChange={handleChange}
        >
          {stateOptions.map((option) => (
            <option key={option._id} value={option._id}>
              {option.stateName}
            </option>
          ))}
        </select>
      </div>

      {/* Conditional Rendering for 'city' */}
      {placeType === "city" && (
        <>
          <div className="mb-3">
            <label htmlFor="bestTimetoVisit" className="form-label">
              Best Time to Visit
            </label>
            <input
              type="text"
              className="form-control"
              id="bestTimetoVisit"
              name="bestTimetoVisit"
              value={formData.bestTimetoVisit}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="idealTripDuration" className="form-label">
              Ideal Trip Duration
            </label>
            <input
              type="text"
              className="form-control"
              id="idealTripDuration"
              name="idealTripDuration"
              placeholder="1"
              value={formData.idealTripDuration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="placeTitle" className="form-label">
              Place Title
            </label>
            <input
              type="text"
              className="form-control"
              id="placeTitle"
              name="placeTitle"
              placeholder="Sri Meenakshi Sundareswarar Temple"
              value={formData.placeTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="placePopular"
              name="placePopular"
              checked={formData.placePopular === "Y"}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="placePopular">
              Is Place Popular?
            </label>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="placeTop"
              name="placeTop"
              checked={formData.placeTop === "Y"}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="placeTop">
              Is Place a Top Destination?
            </label>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="mostPopular"
              name="mostPopular"
              checked={formData.mostPopular === "Y"}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="mostPopular">
              Is Place Most Popular?
            </label>
          </div>
        </>
      )}

      {/* Conditional Rendering for 'sub_place' */}
      {placeType === "sub_place" && (
        <>
          <div className="mb-3">
            <label htmlFor="parentPlace" className="form-label">
              Parent Place
            </label>
            <select
              className="form-select"
              id="parentPlace"
              name="parentPlace"
              value={formData.parentPlace}
              onChange={handleChange}
            >
              {parentPlaceOptions.map((option) => (
                <option key={option._id} value={option._id}>
                  {option.cityName}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="distance" className="form-label">
              Distance
            </label>
            <input
              type="text"
              className="form-control"
              id="distance"
              name="distance"
              placeholder="300kms"
              value={formData.distance}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="placeLocation" className="form-label">
              Place Location
            </label>
            <input
              type="text"
              className="form-control"
              id="placeLocation"
              name="placeLocation"
              placeholder="from bus to 12kms"
              value={formData.placeLocation}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="travelTipes" className="form-label">
              Travel Tips
            </label>
            <textarea
              className="form-control"
              id="travelTipes"
              name="travelTipes"
              placeholder="Good to have cloths"
              value={formData.travelTipes}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="transportOption" className="form-label">
              Transport Options
            </label>
            <input
              type="text"
              className="form-control"
              id="transportOption"
              name="transportOption"
              placeholder="Cab/Car/Auto"
              value={formData.transportOption}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="idealTripDuration" className="form-label">
              Ideal Trip Duration
            </label>
            <input
              type="text"
              className="form-control"
              id="idealTripDuration"
              name="idealTripDuration"
              placeholder="2"
              value={formData.idealTripDuration}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="placeTitle" className="form-label">
              Place Title
            </label>
            <input
              type="text"
              className="form-control"
              id="placeTitle"
              placeholder="Sri Meenakshi Sundareswarar Temple"
              name="placeTitle"
              value={formData.placeTitle}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="placeTop"
              name="placeTop"
              checked={formData.placeTop === "Y"}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="placeTop">
              Is Place a Top Destination?
            </label>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="mustVisit"
              name="mustVisit"
              checked={formData.mustVisit === "Y"}
              onChange={handleCheckboxChange}
            />
            <label className="form-check-label" htmlFor="mustVisit">
              Is Place a Must Visit?
            </label>
          </div>
        </>
      )}
      <div className="col-md-12 mb-3">
        <label htmlFor="images" className="form-label">
          Images
        </label>
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
      {/* Common Field for Image Upload */}
      {/* <div className="mb-3">
        <label htmlFor="images" className="form-label">
          Upload Images
        </label>
        <input
          type="file"
          className="form-control"
          id="images"
          name="images"
          multiple
          accept="image/*"
          onChange={handleFileChange}
        />
        <div className="mt-2">
          {formData.images.length > 0 &&
            formData.images.map((imagePath, index) => {
              const fileName =
                typeof imagePath === "string"
                  ? imagePath.split("\\").pop().split("/").pop()
                  : imagePath.name || "Unknown Image";
              return (
                <div key={index} style={{ marginBottom: "10px" }}>
                  <span>{fileName}</span>
                </div>
              );
            })}
        </div>
      </div> */}
    </form>
  );
};

export default Step1;
