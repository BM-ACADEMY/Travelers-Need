import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PackageCard from '../PackageCard/PackageCard'; // Use the same card component for packages
import '../Statecard/StatePage.css'; // Custom CSS
import { useParams } from 'react-router-dom';

const StatePage = () => {
  const { stateName } = useParams(); // Access stateName from route parameters
  const [stateData, setStateData] = useState(null);
  const [packages, setPackages] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/packages/cities-by-state/${encodeURIComponent(stateName)}`
        );
        console.log(response.data);

        setStateData(response.data.stateDetails); // Set state details
        setPackages(response.data.cities); // Set packages grouped by city
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching state data');
      }
    };

    fetchStateData();
  }, [stateName]);

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  if (!stateData) {
    return <div className="text-center">Loading state details...</div>;
  }

  // Extract stateImage path and construct URL dynamically
  const stateImagePath = stateData.stateImage || '';
  const parts = stateImagePath.split('\\'); // Split path by backslashes

  let fileName = '';
  let stateQuery = stateName.toLowerCase(); // Use stateName from URL params

  // Validate and extract stateName and fileName from the path
  if (parts.length >= 3) {
    fileName = parts.pop(); // Extract the file name
  } else {
    console.warn('Unexpected stateImage format:', stateImagePath);
  }

  // Construct the stateImage URL dynamically
  const stateImageURL = `http://localhost:3000/api/address/image?stateName=${encodeURIComponent(
    stateQuery
  )}&fileName=${encodeURIComponent(fileName)}`;

  return (
    <div className="state-page">
      {/* State Image and Details */}
      <div
        className="state-header"
        style={{
          backgroundImage: `url(${stateImageURL})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="overlay">
          <h1 className="state-name">{stateData.stateName}</h1>
          <p className="starting-price">Starting from ₹{stateData.startingPrice}</p>
        </div>
      </div>

      {/* State Description */}
      <div className="container mt-4">
        <p className="state-description">{stateData.description}</p>
      </div>

      {/* Packages Grid */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Packages in {stateName}</h2>
        <div className="row">
          {Object.keys(packages).map((city) =>
            packages[city].map((pkg) => (
              <div key={pkg.packageId} className="col-md-6 col-lg-4 mb-4">
                <PackageCard pkg={pkg} cityName={city}/>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StatePage;
