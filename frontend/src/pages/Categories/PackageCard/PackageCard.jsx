import React from 'react';
import '../PackageCard/PackageCard.css'; // Add professional styles for cards
import { useNavigate } from 'react-router-dom';

const PackageCard = ({ pkg, cityName }) => {
  const navigate = useNavigate();
  const packageImagePath = pkg.images?.[pkg.images.length - 1] || ''; // Use the last image in the array

  // Normalize path separators and split the path
  const normalizedPath = packageImagePath.replace(/\\/g, '/');
  const pathParts = normalizedPath.split('/'); // Split path into parts

  // Extract the folder name (packageName) after "packages/"
  const packageIndex = pathParts.findIndex((part) => part === 'packages');
  const packageName = packageIndex !== -1 ? pathParts[packageIndex + 1] : '';
  const fileName = pathParts.pop(); // Extract the file name

  // Construct the package image URL
  const packageImageURL = `http://localhost:3000/api/packages/get-package-image?packageName=${encodeURIComponent(
    packageName
  )}&fileName=${encodeURIComponent(fileName)}`;
  const handleClick = () => {
    navigate(`/package/${pkg.packageId}`); // Navigate to PackagePage
  };
  return (
    <div className="package-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="card-image-container">
        <div
          className="card-image"
          style={{
            backgroundImage: `url(${packageImageURL})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        ></div>
        <div className="city-name-overlay">
          <span>{cityName}</span>
        </div>
      </div>
      <div className="card-content">
        <h5 className="package-name">{pkg.name}</h5>
        <p className="package-price">Price: ₹{pkg.price}</p>
        <p className="package-best-month">Best Month: {pkg.bestMonth}</p>
        <button className="btn btn-outline-primary mt-2">View Details</button>
      </div>
    </div>
  );
};

export default PackageCard;
