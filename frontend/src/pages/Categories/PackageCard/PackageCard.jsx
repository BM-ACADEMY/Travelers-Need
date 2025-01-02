import { Link } from 'react-router-dom';
import '../PackageCard/PackageCard.css';

const PackageCard = ({ tourPlan }) => {
  const {
    title,
    duration,
    baseFare,
    itSummaryTitle,
    images = [],
    itTourPlan,
    itPopular
  } = tourPlan;

  // Extract tourCode and fileName from the first image path
  let tourCode = '';
  let fileName = '';
  if (images.length > 0) {
    const parts = images[0].split('\\');
    tourCode = parts[0] || '';
    fileName = parts[1] || '';
  }

  // Construct the image URL dynamically
  const imageUrl = `http://localhost:3000/api/tour-plans/get-tour-plan-image?tourCode=${encodeURIComponent(
    tourCode
  )}&fileName=${encodeURIComponent(fileName)}`;

  return (
    <Link className="" to={`/tour-plan/${tourCode}`} style={{ textDecoration: 'none' }}>
      <div className="package-card">
        <div
          className="package-card-image"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="badge-container">
            {itTourPlan === 'Y' && <span className="advanced-badge">Advanced</span>}
            {itPopular === 'Y' && <span className="popular-badge">Popular</span>}
          </div>
        </div>
        <div className="package-card-details">
          <h3 className="package-title">{title}</h3>
          <p className="package-summary">{itSummaryTitle}</p>
          <div className="package-meta">
            <span>{duration} Days</span>
            <span>₹{baseFare}</span>
          </div>
          <Link className="package-cta" to={`/tour-plan/${tourCode}`}>
            View Details
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default PackageCard;
