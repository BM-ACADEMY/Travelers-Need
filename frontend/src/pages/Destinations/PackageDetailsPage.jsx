import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "lightbox2/dist/css/lightbox.min.css";
import "lightbox2/dist/js/lightbox.min.js";

const PackageDetailsPage = () => {
  const { packageId } = useParams(); // Get packageId from route params
  const [packageDetails, setPackageDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    lightbox.option({
      resizeDuration: 200,
      wrapAround: true,
      showImageNumberLabel: true,
    });
  }, []);
  
  useEffect(() => {
    const fetchPackageDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/packages/get-package-by-id/${packageId}`
        );
        setPackageDetails(response.data);
      } catch (error) {
        console.error("Error fetching package details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackageDetails();
  }, [packageId]);

  if (loading) {
    return <div className="text-center mt-5">Loading package details...</div>;
  }

  if (!packageDetails) {
    return (
      <div className="text-center mt-5">
        Package not found or an error occurred.
      </div>
    );
  }

  const { name, description, price, inclusions, images } = packageDetails;

  // Process image URLs
  const packageImageURLs = images.map((imagePath) => {
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const pathParts = normalizedPath.split("/");
    const packageIndex = pathParts.findIndex((part) => part === "packages");
    const packageName = packageIndex !== -1 ? pathParts[packageIndex + 1] : "";
    const fileName = pathParts.pop();

    return `http://localhost:3000/api/packages/get-package-image?packageName=${encodeURIComponent(
      packageName
    )}&fileName=${encodeURIComponent(fileName)}`;
  });

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{name}</h2>
      <div className="row">
        {/* Left Column: Image Gallery */}
        <div className="col-md-6">
          <h5>Photo Gallery</h5>
          <div className="row">
            {packageImageURLs.map((url, index) => (
              <div key={index} className="col-lg-6 col-md-6 col-sm-12 mb-3">
                <a href={url} data-lightbox="gallery" data-title={`Image ${index + 1}`}>
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    className="img-fluid rounded"
                    style={{ objectFit: "cover", height: "200px", width: "100%" }}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Package Details */}
        <div className="col-md-6">
          <h4>About the Package</h4>
          <p>{description}</p>
          <h5>Price: ₹{price}</h5>
          <h5>Inclusions:</h5>
          <ul>
            {inclusions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailsPage;
