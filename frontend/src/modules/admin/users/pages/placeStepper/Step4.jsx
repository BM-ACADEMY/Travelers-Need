// import React from "react";
// import { Grid, TextField, Button, IconButton, Typography } from "@mui/material";
// import { AddCircle, RemoveCircle } from "@mui/icons-material";

// const Step4 = ({ formData, onFormDataChange, placeType }) => {
//   // Ensure formData.season is always an array
//   const seasons = Array.isArray(formData.season) ? formData.season : [];

//   const handleSeasonChange = (index, key, value) => {
//     const updatedSeasons = [...seasons];
//     updatedSeasons[index][key] = value;
//     onFormDataChange({ season: updatedSeasons });
//   };

//   const addSeason = () => {
//     const newSeason = { title: "", description: "" };
//     onFormDataChange({ season: [...seasons, newSeason] });
//   };

//   const removeSeason = (index) => {
//     const updatedSeasons = seasons.filter((_, i) => i !== index);
//     onFormDataChange({ season: updatedSeasons });
//   };

//   return (
//     <>
//       {placeType === "city" ? (
//         <Grid container spacing={2}>
//           {/* Season Array */}
//           {seasons.map((season, index) => (
//             <Grid container item spacing={2} key={index}>
//               {/* Season Title */}
//               <Grid item xs={5}>
//                 <TextField
//                   label={`Season Title #${index + 1}`}
//                   fullWidth
//                   value={season.title}
//                   onChange={(e) =>
//                     handleSeasonChange(index, "title", e.target.value)
//                   }
//                 />
//               </Grid>

//               {/* Season Description */}
//               <Grid item xs={5}>
//                 <TextField
//                   label="Season Description"
//                   fullWidth
//                   multiline
//                   value={season.description}
//                   onChange={(e) =>
//                     handleSeasonChange(index, "description", e.target.value)
//                   }
//                 />
//               </Grid>

//               {/* Remove Season */}
//               <Grid
//                 item
//                 xs={2}
//                 style={{ display: "flex", alignItems: "center" }}
//               >
//                 <IconButton
//                   color="error"
//                   onClick={() => removeSeason(index)}
//                   disabled={seasons.length === 1}
//                 >
//                   <RemoveCircle />
//                 </IconButton>
//               </Grid>
//             </Grid>
//           ))}

//           {/* Add New Season */}
//           <Grid item xs={12}>
//             <Button
//               variant="outlined"
//               startIcon={<AddCircle />}
//               onClick={addSeason}
//               fullWidth
//               sx={{
//                 borderColor: "#ef156c", // Set border color
//                 color: "#ef156c", // Set text color
//                 "& .MuiSvgIcon-root": {
//                   color: "#ef156c", // Set icon color
//                 },
//                 "&:hover": {
//                   borderColor: "#ef156c", // Maintain border color on hover
//                   backgroundColor: "rgba(239, 21, 108, 0.1)", // Optional: Light background on hover
//                 },
//               }}
//             >
//               Add Season
//             </Button>
//           </Grid>

//           {/* Nearest City */}
//           <Grid item xs={12}>
//             <TextField
//               label="Nearest City"
//               fullWidth
//               name="nearestCity"
//               value={formData.nearestCity || ""}
//               onChange={(e) =>
//                 onFormDataChange({ nearestCity: e.target.value })
//               }
//             />
//           </Grid>

//           {/* Peak Season */}
//           <Grid item xs={12}>
//             <TextField
//               label="Peak Season"
//               fullWidth
//               name="peakSeason"
//               value={formData.peakSeason || ""}
//               onChange={(e) => onFormDataChange({ peakSeason: e.target.value })}
//             />
//           </Grid>
//         </Grid>
//       ) : (
//         <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 2 }}>
//           No additional details required for sub-places.
//         </Typography>
//       )}
//     </>
//   );
// };

// export default Step4;




import React from "react";

const Step4 = ({ formData, onFormDataChange, placeType }) => {
  // Ensure formData.season is always an array
  const seasons = Array.isArray(formData.season) ? formData.season : [];

  const handleSeasonChange = (index, key, value) => {
    const updatedSeasons = [...seasons];
    updatedSeasons[index][key] = value;
    onFormDataChange({ season: updatedSeasons });
  };

  const addSeason = () => {
    const newSeason = { title: "", description: "" };
    onFormDataChange({ season: [...seasons, newSeason] });
  };

  const removeSeason = (index) => {
    const updatedSeasons = seasons.filter((_, i) => i !== index);
    onFormDataChange({ season: updatedSeasons });
  };

  return (
    <>
      {placeType === "city" ? (
        <div className="row g-3">
          {/* Season Array */}
          {seasons.map((season, index) => (
            <div className="col-12" key={index}>
              <div className="row g-3">
                {/* Season Title */}
                <div className="col-md-5">
                  <label htmlFor={`seasonTitle${index}`} className="form-label">
                    Season Title #{index + 1}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`seasonTitle${index}`}
                    placeholder="Title"
                    value={season.title}
                    onChange={(e) =>
                      handleSeasonChange(index, "title", e.target.value)
                    }
                  />
                </div>

                {/* Season Description */}
                <div className="col-md-5">
                  <label
                    htmlFor={`seasonDescription${index}`}
                    className="form-label"
                  >
                    Season Description
                  </label>
                  <textarea
                    className="form-control"
                    id={`seasonDescription${index}`}
                    rows="3"
                    placeholder="Description"
                    value={season.description}
                    onChange={(e) =>
                      handleSeasonChange(index, "description", e.target.value)
                    }
                  />
                </div>

                {/* Remove Season */}
                <div className="col-md-2 d-flex align-items-center">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeSeason(index)}
                    disabled={seasons.length === 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add New Season */}
          <div className="col-12">
            <button
              type="button"
              className="btn btn-outline-danger w-100"
              onClick={addSeason}
            >
              <i className="bi bi-plus-circle me-2"></i> Add Season
            </button>
          </div>

          {/* Nearest City */}
          <div className="col-12">
            <label htmlFor="nearestCity" className="form-label">
              Nearest City
            </label>
            <input
              type="text"
              className="form-control"
              id="nearestCity"
              name="nearestCity"
              placeholder="Ex:Kochi"
              value={formData.nearestCity || ""}
              onChange={(e) => onFormDataChange({ nearestCity: e.target.value })}
            />
          </div>

          {/* Peak Season */}
          <div className="col-12">
            <label htmlFor="peakSeason" className="form-label">
              Peak Season
            </label>
            <input
              type="text"
              className="form-control"
              id="peakSeason"
              name="peakSeason"
              placeholder="October to December"
              value={formData.peakSeason || ""}
              onChange={(e) => onFormDataChange({ peakSeason: e.target.value })}
            />
          </div>
        </div>
      ) : (
        <div className="text-center mt-3">
          <h6 className="text-muted">No additional details required for sub-places.</h6>
        </div>
      )}
    </>
  );
};

export default Step4;

