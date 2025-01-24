import React, { useState } from 'react';
import StateCard from './Statecard/StateCard';
import { useNavigate } from 'react-router-dom';

const Honeymoon_category = ({ honeymoonData }) => {
    const [selectedState, setSelectedState] = useState(null);
    const navigate = useNavigate();

    if (!honeymoonData || !Array.isArray(honeymoonData) || honeymoonData.length === 0) {
        return <p className="text-center">No Honeymoon Destinations Available</p>;
    }
    var BASE_URL = import.meta.env.VITE_BASE_URL;
    // Handle state selection and navigation
    const handleStateClick = (stateName) => {
        setSelectedState(stateName);
        navigate(`/city-view/${encodeURIComponent(stateName)}`); // Navigate to CityView with the state name
    };

    return (
        <div className="container mt-5">
            <h4 className=" mb-4" style={{color :'rgba(40,41,65,1)'}}>HONEYMOON DESTINATIONS</h4>
            <div className="row">
                {honeymoonData.map((stateData, index) => {
                    const stateName = stateData.state || 'Unknown'; // Extract state name
                    const startingPrice = stateData.startingPrice || 'N/A'; // Extract starting price
                    const imagePath = stateData.image || ''; // Extract image path
                    const cityCount = stateData.tourPlanCount || 0; // Extract city count
                    const firstPackage = stateData.tourPlans?.[0]?.title || 'No Packages'; // First package title

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
                        <div key={index} className="col-md-4 col-lg-2 mb-4">
                            <StateCard
                                stateName={stateName}
                                stateImage={stateImageURL} // Use dynamically constructed image URL
                                startingPrice={startingPrice}
                                cityCount={cityCount} // Number of cities
                                packageName={firstPackage} // First package title
                                onClick={() => handleStateClick(stateName)} // Handle state click
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Honeymoon_category;
