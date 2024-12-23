import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PackageCard from '../PackageCard/PackageCard';

const CityView = ({ stateName }) => {
  const [cities, setCities] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/packages/cities-by-state/${encodeURIComponent(stateName)}`
        );
        setCities(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching cities');
      }
    };

    fetchCities();
  }, [stateName]);

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  if (Object.keys(cities).length === 0) {
    return <div className="text-center">No cities available</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Packages in {stateName}</h2>
      <div className="row">
        {Object.keys(cities).map((city, index) => (
          <div key={index} className="col-12">
            <h3 className="text-center mb-4">{city}</h3>
            <div className="row">
              {cities[city].map((pkg) => (
                <div key={pkg.packageId} className="col-md-6 col-lg-4 mb-4">
                  <PackageCard pkg={pkg} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityView;
