import React from "react";
import StateCard from "./Statecard/StateCard";

const Trending_category = ({ trendingData }) => {
  if (!trendingData || Object.keys(trendingData).length === 0) {
    return <div className="text-center">No Trending Destinations Available</div>;
  }
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  return (
    <div className="container mt-5">
      <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>TRENDING DESTINATIONS</h4>
      <div className="row">
        {Object.keys(trendingData).map((state, index) => {
          const stateDetails = trendingData[state]?.stateDetails || {};
          const cityDetails = trendingData[state]?.cities || {};

          // Extract stateName and fileName from the stateImage path
          const stateImagePath = stateDetails.stateImage || "";
          const parts = stateImagePath.split("\\"); // Handle backslash-separated paths
          const stateName = parts[2]; // Extract "pondicherry"
          const fileName = parts.pop(); // Extract "1734516065233-765553093-ganesh-ratha-temple.jpg"

          // Construct the stateImage URL dynamically
          console.log(fileName,stateName);
          
          const stateImageURL = `${BASE_URL}/address/image?stateName=${encodeURIComponent(
            stateName
          )}&fileName=${encodeURIComponent(fileName)}`;

          const firstCity = Object.keys(cityDetails)[0];
          const firstPackage = cityDetails[firstCity]?.[0]?.name || "No Packages";

          return (
            <div key={index} className="col-md-4 col-lg-2 ">
              <StateCard
                stateName={stateDetails.stateName || state}
                stateImage={stateImageURL} // Use dynamically constructed URL
                startingPrice={stateDetails.startingPrice}
                cityCount={Object.keys(cityDetails).length}
                packageName={firstPackage}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Trending_category;
