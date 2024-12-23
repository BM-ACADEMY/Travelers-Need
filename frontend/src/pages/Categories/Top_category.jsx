import React from 'react';
import StateCard from './Statecard/StateCard';

const Top_category = ({topDestinationsData}) => {
    if (!topDestinationsData || Object.keys(topDestinationsData).length === 0) {
        return <div className="text-center">No Top Destinations Available</div>;
      }
    
      return (
        <div className="container mt-5">
          <h2 className="text-center mb-4">TOP DESTINATIONS</h2>
          <div className="row">
            {Object.keys(topDestinationsData).map((state, index) => {
              const stateDetails = topDestinationsData[state]?.stateDetails || {};
              const cityDetails = topDestinationsData[state]?.cities || {};
    
              // Extract stateName and fileName from the stateImage path
              const stateImagePath = stateDetails.stateImage || "";
              const parts = stateImagePath.split("\\"); // Split path by backslashes
              
              let stateName = state; // Default to the state key
              let fileName = "";
    
              // Validate and extract stateName and fileName from the path
              if (parts.length >= 3) {
                stateName = parts[2]; // Extract "pondicherry" from the path
                fileName = parts.pop(); // Extract the file name
              } else {
                console.warn("Unexpected stateImage format:", stateImagePath);
              }
    
              // Construct the stateImage URL dynamically
              const stateImageURL = `http://localhost:3000/api/address/image?stateName=${encodeURIComponent(
                stateName
              )}&fileName=${encodeURIComponent(fileName)}`;
    
              const firstCity = Object.keys(cityDetails)[0];
              const firstPackage = cityDetails[firstCity]?.[0]?.name || "No Packages";
    
              return (
                <div key={index} className="col-md-4 mb-4">
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
        </div>)
}

export default Top_category;
