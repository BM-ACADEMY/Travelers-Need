// import React from "react";
// import { Grid, TextField, MenuItem, Typography } from "@mui/material";

// const Step3 = ({ formData, onFormDataChange, placeType }) => {
//   // Default to empty arrays if undefined
//   const languageSpoken = Array.isArray(formData.languageSpoken) ? formData.languageSpoken : [];
//   const majorFestivals = Array.isArray(formData.majorFestivals) ? formData.majorFestivals : [];

//   return (
//     <>
//       {placeType === "city" ? (
//         <Grid container spacing={2}>
//           {/* Internet Availability */}
//           <Grid item xs={12}>
//             <TextField
//               select
//               label="Internet Availability"
//               fullWidth
//               name="internetAvailability"
//               value={formData.internetAvailability || "Moderate"}
//               onChange={(e) => onFormDataChange({ internetAvailability: e.target.value })}
//             >
//               <MenuItem value="Good">Good</MenuItem>
//               <MenuItem value="Moderate">Moderate</MenuItem>
//               <MenuItem value="None">None</MenuItem>
//             </TextField>
//           </Grid>

//           {/* STD Code */}
//           <Grid item xs={12}>
//             <TextField
//               label="STD Code"
//               fullWidth
//               name="stdCode"
//               value={formData.stdCode || ""}
//               onChange={(e) => onFormDataChange({ stdCode: e.target.value })}
//             />
//           </Grid>

//           {/* Languages Spoken */}
//           <Grid item xs={12}>
//             <TextField
//               label="Languages Spoken (Comma-separated)"
//               fullWidth
//               name="languageSpoken"
//               value={languageSpoken.join(", ")} // Safe join for an array
//               onChange={(e) =>
//                 onFormDataChange({
//                   languageSpoken: e.target.value.split(",").map((lang) => lang.trim()),
//                 })
//               }
//             />
//           </Grid>

//           {/* Major Festivals */}
//           <Grid item xs={12}>
//             <TextField
//               label="Major Festivals (Comma-separated)"
//               fullWidth
//               name="majorFestivals"
//               value={majorFestivals.join(", ")} // Safe join for an array
//               onChange={(e) =>
//                 onFormDataChange({
//                   majorFestivals: e.target.value.split(",").map((festival) => festival.trim()),
//                 })
//               }
//             />
//           </Grid>

//           {/* Notes or Tips */}
//           <Grid item xs={12}>
//             <TextField
//               label="Notes or Tips"
//               fullWidth
//               multiline
//               rows={3}
//               name="notesOrTips"
//               value={formData.notesOrTips || ""}
//               onChange={(e) => onFormDataChange({ notesOrTips: e.target.value })}
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

// export default Step3;


import React from "react";

const Step3 = ({ formData, onFormDataChange, placeType }) => {
  // Default to empty arrays if undefined
  const languageSpoken = Array.isArray(formData.languageSpoken) ? formData.languageSpoken : [];
  const majorFestivals = Array.isArray(formData.majorFestivals) ? formData.majorFestivals : [];

  return (
    <>
      {placeType === "city" ? (
        <div className="row g-3">
          {/* Internet Availability */}
          <div className="col-12">
            <label htmlFor="internetAvailability" className="form-label">
              Internet Availability
            </label>
            <select
              className="form-select"
              id="internetAvailability"
              name="internetAvailability"
              value={formData.internetAvailability || "Moderate"}
              onChange={(e) => onFormDataChange({ internetAvailability: e.target.value })}
            >
              <option value="Good">Good</option>
              <option value="Moderate">Moderate</option>
              <option value="None">None</option>
            </select>
          </div>

          {/* STD Code */}
          <div className="col-12">
            <label htmlFor="stdCode" className="form-label">
              STD Code
            </label>
            <input
              type="text"
              className="form-control"
              id="stdCode"
              name="stdCode"
              placeholder="+91"
              value={formData.stdCode || ""}
              onChange={(e) => onFormDataChange({ stdCode: e.target.value })}
            />
          </div>

          {/* Languages Spoken */}
          <div className="col-12">
            <label htmlFor="languageSpoken" className="form-label">
              Languages Spoken (Comma-separated)
            </label>
            <input
              type="text"
              className="form-control"
              id="languageSpoken"
              name="languageSpoken"
              placeholder="Tamil,english"
              value={languageSpoken.join(", ")} // Safe join for an array
              onChange={(e) =>
                onFormDataChange({
                  languageSpoken: e.target.value.split(",").map((lang) => lang.trim()),
                })
              }
            />
          </div>

          {/* Major Festivals */}
          <div className="col-12">
            <label htmlFor="majorFestivals" className="form-label">
              Major Festivals (Comma-separated)
            </label>
            <input
              type="text"
              className="form-control"
              id="majorFestivals"
              name="majorFestivals"
              placeholder="Christmas,Onam,Holy"
              value={majorFestivals.join(", ")} // Safe join for an array
              onChange={(e) =>
                onFormDataChange({
                  majorFestivals: e.target.value.split(",").map((festival) => festival.trim()),
                })
              }
            />
          </div>

          {/* Notes or Tips */}
          <div className="col-12">
            <label htmlFor="notesOrTips" className="form-label">
              Notes or Tips
            </label>
            <textarea
              className="form-control"
              id="notesOrTips"
              name="notesOrTips"
              placeholder="Good to have first aid box"
              rows="3"
              value={formData.notesOrTips || ""}
              onChange={(e) => onFormDataChange({ notesOrTips: e.target.value })}
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

export default Step3;
