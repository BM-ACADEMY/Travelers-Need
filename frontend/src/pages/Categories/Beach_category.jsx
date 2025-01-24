import React, { useEffect } from 'react';
import StateCard from './Statecard/StateCard';

const Beach_category = ({ beachData }) => {
    // Validate beachData
    if (!beachData || !Array.isArray(beachData) || beachData.length === 0) {
        return <p className="text-center">No Beach Destinations Available</p>;
    }

    var BASE_URL = import.meta.env.VITE_BASE_URL;
   
    useEffect(() => {
        console.log(beachData);
    }, [beachData]);

    return (
        <div className="container mt-5">
            <h4 className=" mb-4" style={{ color: 'rgba(40,41,65,1)' }}>BEACH DESTINATIONS</h4>
            <div className="row">
                {beachData.map((stateData, index) => {
                    const stateName = stateData.state || 'Unknown'; // Extract state name
                    const startingPrice = stateData.startingPrice || 'N/A'; // Extract starting price
                    const imagePath = stateData.image || ''; // Extract image path
                    const tourPlans = stateData.tourPlans || []; // Extract tour plans

                    // Construct dynamic image URL
                    let stateImageURL = '';
                    if (imagePath) {
                        const parts = imagePath.split('\\'); // Split the path by backslashes
                        const fileName = parts.pop(); // Get the file name
                        const stateCode = parts.length > 0 ? parts[0] : 'Unknown'; // Get the state code

                        stateImageURL = `${BASE_URL}/address/get-image?state=${encodeURIComponent(
                            stateCode
                        )}&fileName=${encodeURIComponent(fileName)}`;
                    }

                    return (
                        <div key={index} className="col-md-4 col-lg-3 mb-4">
                            <StateCard
                                stateName={stateName}
                                stateImage={stateImageURL} // Use the dynamically constructed image URL
                                startingPrice={startingPrice}
                                cityCount={stateData.tourPlanCount} // Number of tour plans
                                packageName={tourPlans[0]?.title || 'No Packages'} // First package title
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Beach_category;
