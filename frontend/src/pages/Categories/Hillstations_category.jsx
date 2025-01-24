import React from 'react';
import StateCard from './Statecard/StateCard';

const Hillstations_category = ({hillStationsData}) => {
    if (!hillStationsData || Object.keys(hillStationsData).length === 0) {
        return <p className="text-center">No Hill Station Destinations Available</p>;
      }
      var BASE_URL = import.meta.env.VITE_BASE_URL;
      return (
        <div className="container mt-5">
          <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>HILL STATION DESTINATIONS</h4>
          <div className="row">
            {Object.keys(hillStationsData).map((state, index) => {
              const stateDetails = hillStationsData[state]?.stateDetails || {};
              const cityDetails = hillStationsData[state]?.cities || {};
    
              // Extract stateName and fileName from the stateImage path
              const stateImagePath = stateDetails.stateImage || "";
              const parts = stateImagePath.split("\\"); // Split path by backslashes
    
              let stateName = state; // Default to the state key
              let fileName = "";
    
              // Validate and extract stateName and fileName from the path
              if (parts.length >= 3) {
                stateName = parts[2]; // Extract "hillstation_name" from the path
                fileName = parts.pop(); // Extract the file name
              } else {
                console.warn("Unexpected stateImage format:", stateImagePath);
              }
    
              // Construct the stateImage URL dynamically
              const stateImageURL = `${BASE_URL}/address/image?stateName=${encodeURIComponent(
                stateName
              )}&fileName=${encodeURIComponent(fileName)}`;
    
              const firstCity = Object.keys(cityDetails)[0];
              const firstPackage = cityDetails[firstCity]?.[0]?.name || "No Packages";
    
              return (
                <div key={index} className="col-md-4 col-lg-2 mb-4">
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
}

export default Hillstations_category;
