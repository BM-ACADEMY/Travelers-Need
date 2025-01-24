import React, { useEffect } from 'react';
import StateCard from './Statecard/StateCard';

const Pilgrimage_category = ({ pilgrimageData }) => {
    // Validate the input data
    if (!pilgrimageData || !Array.isArray(pilgrimageData) || pilgrimageData.length === 0) {
        return <p className="text-center">No Pilgrimage Destinations Available</p>;
    }
    var BASE_URL = import.meta.env.VITE_BASE_URL;
    useEffect(() => {
        console.log('Pilgrimage Data:', pilgrimageData);
    }, [pilgrimageData]);

    return (
        <div className="container mt-5">
            <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>PILGRIMAGE DESTINATIONS</h4>
            <div className="row">
                {pilgrimageData.map((stateData, index) => {
                    const {
                        state = 'Unknown', // State name
                        startingPrice = 'N/A', // Starting price
                        image = '', // Image path
                        tourPlans = [], // Tour plans
                        tourPlanCount = 0, // Number of tour plans
                    } = stateData;

                    // Construct the dynamic image URL
                    let stateImageURL = '';
                    if (image) {
                        const parts = image.split('\\');
                        const fileName = parts.pop();
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
                                cityCount={tourPlanCount} // Number of cities
                                packageName={firstPackageName} // First package name
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Pilgrimage_category;
