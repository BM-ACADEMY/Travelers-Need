import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Destinations/Top_destinations.css";
import { useNavigate } from "react-router-dom";
import ReusableModal from "../model/ReusableModel";
import QuoteForm from "../model/QuoteForm";

// Helper function to construct image URL

const Top_destinations = () => {
  const [statePopularCities, setStatePopularCities] = useState([]);
  const [countryPopularCities, setCountryPopularCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  var BASE_URL = import.meta.env.VITE_BASE_URL;
  const constructImageURL = (imagePath) => {
    const parts = imagePath?.split("\\");
    let placeName = "";
    let fileName = "";
  
    if (parts?.length >= 2) {
      placeName = parts[0];
      fileName = parts[1];
    } else {
      console.warn("Unexpected image path format:", imagePath);
    }
  
    return `${BASE_URL}/places/get-image?placeName=${encodeURIComponent(
      placeName
    )}&fileName=${encodeURIComponent(fileName)}`;
  };
  
 useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/places/get-all-popular-place`
        );

        const { statePopularCities, countryPopularCities } = response.data;

        const transformedCountryPopularCities = countryPopularCities.map((city) => ({
          ...city,
          imageURL: constructImageURL(city.images?.[0]),
        }));

        const transformedStatePopularCities = statePopularCities.map((city) => ({
          ...city,
          imageURL: constructImageURL(city.images?.[0]),
        }));

        setStatePopularCities(transformedStatePopularCities || []);
        setCountryPopularCities(transformedCountryPopularCities || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDestinations();

    // Trigger the modal after 3 seconds
    

   // Cleanup timeout on component unmount
  }, []);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsModalOpen(true);
    }, 5000); // Show modal after 3 seconds

    return () => clearTimeout(timeout); // Cleanup on unmount
  }, []);

  const closeModal = () => setIsModalOpen(false);

  const handleFormSubmit = (formData) => {
    closeModal();
  };

  const handleShowMore = (stateName) => {
    navigate(`/state-popular-places/${stateName}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      {/* Most Popular Destinations in India */}
      <h4 className="section-title">Most Popular Destinations in India</h4>
      <div className="grid-container">
        {countryPopularCities.slice(0, 5).map((place) => (
          <div
            key={place._id}
            className="grid-item"
            onClick={() => navigate(`/details/${place?.state?.state}/${place.state.city}`)}
          >
            <div className="destination-card">
              <img
                src={place.imageURL}
                alt={place.name}
                className="img-fluid rounded"
              />
              <div className="place-name">{place.name}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-3">
        <button
          className="btn"
          onClick={() => navigate("/all-popular-places")}
          style={{backgroundColor:"#ef156c",color:"white"}}
        >
          Show More Places
        </button>
      </div>

      {/* Top Destinations by State */}
      {/* <h2 className="section-title mt-5">Top Destinations by State</h2> */}
      {statePopularCities.map((state) => (
        <div key={state.state._id} className="mb-5">
          <h4 className="section-title">Top Destinations in {state.state?.state || "Unknown State"}</h4>
          <div className="grid-container">
            <div
              className="grid-item"
              onClick={() => navigate(`/details/${state?.state?.state}/${state?.state?.city}`)}
            >
              <div className="destination-card">
                <img
                  src={state.imageURL}
                  alt={state.name}
                  className="img-fluid rounded"
                />
                <div className="place-name">{state.name}</div>
              </div>
            </div>
          </div>
          <div className="text-center mt-3">
            <button
              className="btn "
              style={{backgroundColor:"#ef156c",color:"white"}}
              onClick={() => handleShowMore(state.state?.state)}
            >
              Show More Places in {state.state?.state}
            </button>
          </div>
        </div>
      ))}
       <ReusableModal isOpen={isModalOpen} onClose={closeModal}>
        <QuoteForm onSubmit={handleFormSubmit} />
      </ReusableModal>
    </div>
  );
};

export default Top_destinations;
