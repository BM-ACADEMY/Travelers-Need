import React, { useEffect } from 'react';
import StateCard from './Statecard/StateCard';

const Top_category = ({ topDestinationsData }) => {
  if (!topDestinationsData || !Array.isArray(topDestinationsData)|| topDestinationsData.length === 0) {
    return <div className="text-center">No Top Destinations Available</div>;
  }
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    console.log("Top Destinations Data:", topDestinationsData);
  }, [topDestinationsData]);

  return (
    <div className="container mt-5">
      <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>TOP DESTINATIONS</h4>
      <div className="row">
        {topDestinationsData.map((destination, index) => {
          const {
            state,
            startingPrice,
            image,
            tourPlans = [],
          } = destination;

          const imageName = image ? image.split('\\').pop() : 'default.jpg';
          const stateName = state || 'Unknown State';
          const firstTourPlan = tourPlans[0]?.title || 'No Packages Available';
          const tourPlanCount = tourPlans.length || 0;

          const stateImageURL = `${BASE_URL}/address/get-image?state=${encodeURIComponent(
            stateName
          )}&fileName=${encodeURIComponent(imageName)}`;

          return (
            <div key={index} className="col-md-4 col-lg-3 mb-4">
              <StateCard
                stateName={stateName}
                stateImage={stateImageURL}
                startingPrice={startingPrice}
                cityCount={tourPlanCount}
                packageName={firstTourPlan}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Top_category;
