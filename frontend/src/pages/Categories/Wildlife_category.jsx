import React, { useEffect } from 'react';
import StateCard from './Statecard/StateCard';

const Wildlife_category = ({ wildlifeData }) => {
    // Validate the input data
    if (!wildlifeData || !Array.isArray(wildlifeData) || wildlifeData.length === 0) {
        return <div className="text-center">No Wildlife Destinations Available</div>;
    }
    var BASE_URL = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        console.log('Wildlife Data:', wildlifeData);
    }, [wildlifeData]);

    return (
        <div className="container mt-5">
            <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>WILDLIFE DESTINATIONS</h4>
            <div className="row">
                {wildlifeData.map((stateData, index) => {
                    const {
                        state = 'Unknown', // Extract state name
                        startingPrice = 'N/A', // Extract starting price
                        image = '', // Extract image path
                        tourPlans = [], // Extract tour plans
                        tourPlanCount = 0, // Extract number of tour plans
                    } = stateData;

                    // Construct dynamic image URL
                    let stateImageURL = '';
                    if (image) {
                        const parts = image.split('\\'); // Split the path by backslashes
                        const fileName = parts.pop(); // Get the file name
                        const stateCode = parts.join('\\'); // Ensure correct state extraction
                        stateImageURL = `${BASE_URL}/address/get-image?state=${encodeURIComponent(
                            stateCode
                        )}&fileName=${encodeURIComponent(fileName)}`;
                    }

                    // Prepare StateCard props
                    const firstPackageName = tourPlans.length > 0 ? tourPlans[0].title : 'No Packages';

                    return (
                        <div key={index} className="col-md-4 col-lg-3 mb-4">
                            <StateCard
                                stateName={state} // State name
                                stateImage={stateImageURL} // Image URL
                                startingPrice={startingPrice} // Starting price
                                cityCount={tourPlanCount} // Number of tour plans
                                packageName={firstPackageName} // First package name
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Wildlife_category;
