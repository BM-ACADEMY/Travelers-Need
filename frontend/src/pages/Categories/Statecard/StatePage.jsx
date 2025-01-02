import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../Statecard/StatePage.css";
import PackageCard from '../PackageCard/PackageCard'

const StatePage = () => {
  const { stateName } = useParams(); // Access stateName from route parameters
  const [stateData, setStateData] = useState(null);
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [topPackages, setTopPackages] = useState([]);

  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/tour-plans/tour-plans/state/${encodeURIComponent(
            stateName
          )}`
        );

        console.log(response.data);

        setStateData(response.data.tourPlans[0]?.addressId || {}); // Set state details
        setPackages(response.data.tourPlans || []); // Set all packages
        // Filter top 5 packages with itTop === "Y"
        const topPackagesData = response.data.tourPlans
          .filter((pkg) => pkg.itTop === "Y")
          .slice(0, 5);
        setTopPackages(topPackagesData);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching state data");
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
  const stateImagePath = stateData.images?.[0] || "";
  const parts = stateImagePath.split("\\"); // Split path by backslashes
  let fileName = "";
  let stateQuery = stateName.toLowerCase(); // Use stateName from URL params

  if (parts.length >= 2) {
    fileName = parts.pop(); // Extract the file name
  } else {
    console.warn("Unexpected stateImage format:", stateImagePath);
  }

  const stateImageURL = `http://localhost:3000/api/address/get-image?state=${encodeURIComponent(
    stateQuery
  )}&fileName=${encodeURIComponent(fileName)}`;

  return (
    <div className="state-page">
      {/* State Header */}
      <div
        className="state-header"
        style={{
          backgroundImage: `url(${stateImageURL})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          height: "400px",
        }}
      >
        <div className="text-center" style={{ paddingTop: "150px", color: "#fff" }}>
          <h1 className="state-name">{stateData.state}</h1>
          <p className="starting-price">Starting from ₹{stateData.startingPrice}</p>
        </div>
      </div>

      {/* State Description */}
      <div className="container mt-4">
        <p
          className={`state-description ${
            showFullDescription ? "expanded" : "collapsed"
          }`}
          dangerouslySetInnerHTML={{
            __html: showFullDescription
              ? stateData.description
              : stateData.description.split("<br>").slice(0, 5).join("<br>"),
          }}
        ></p>
        <button
          className="btn btn-link read-more-toggle"
          onClick={() => setShowFullDescription((prev) => !prev)}
        >
          {showFullDescription ? "Read Less" : "Read More"}
        </button>
      </div>

      {/* Top 5 Packages Table */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">Top 5 Packages in {stateName}</h2>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Package</th>
              <th>Duration</th>
              <th>Starting Price</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {topPackages.length > 0 ? (
              topPackages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.title}</td>
                  <td>
                    {pkg.duration} Days / {Math.max(pkg.duration - 1, 1)} Nights
                  </td>
                  <td>₹{pkg.baseFare}</td>
                  <td>
                    <a
                      href={`/tour-plan/${pkg.tourCode}`}
                      className="btn btn-danger"
                      style={{ backgroundColor: "#ef156c" }}
                    >
                      View Details
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No Top Packages Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Packages Grid */}
      <div className="container mt-5">
        <h2 className="text-center mb-4">All Packages in {stateName}</h2>
        {packages.length > 0 ? (
          <div className="row">
            {packages.map((tourPlan) => (
              <div key={tourPlan._id} className="col-md-6 col-lg-4 mb-4">
                <PackageCard tourPlan={tourPlan} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">No Tour Plans Found</div>
        )}
      </div>
    </div>
  );
};

export default StatePage;
