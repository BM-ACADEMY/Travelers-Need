import React from 'react';
import ThemeCard from './ThemeCard/ThemeCard';

const ThemesCategory = ({ themesData }) => {
  if (!themesData || Object.keys(themesData).length === 0) {
    return (
      <div className="text-center mt-5">
        <h5>No Themes Available</h5>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center text-uppercase mb-4">Our Themes</h2>
      <div className="row gy-4">
        {/* Use Object.values to convert the object into an array of values */}
        {Object.values(themesData).map((theme, index) => {
          // Construct the image URL dynamically
            const themeImagePath = theme.themeImage || '';
            const parts = themeImagePath.split('\\'); // Handle Windows-style paths
            const themeName = parts[2]; // Extract the theme name from the path
            const fileName = parts.pop(); // Extract the file name

            const themeImageURL = `http://localhost:3000/api/themes/get-image-by-query?themeName=${encodeURIComponent(
              themeName
            )}&fileName=${encodeURIComponent(fileName)}`;

          return (
            <div key={index} className="col-md-4 col-lg-3">
              {/* Render ThemeCard with the correct data */}
              <ThemeCard
                themeImage={themeImageURL}
                themename={theme.themename}
                packageCount={theme.packageCount}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThemesCategory;
