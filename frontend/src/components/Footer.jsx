import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons"; // Solid icons
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faYoutube,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons"; // Brand icons
import '../components/Footer.css';

const Footer = ({ themes, topPackages, internationalDestinations }) => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically

  const handleCall = () => {
    window.location.href = "tel:+91"; // Initiates a call
  };

  const handleWhatsApp = () => {
    const phoneNumber = "+91";
    window.open(`https://wa.me/${phoneNumber.replace("+", "")}`, "_blank"); // Redirects to WhatsApp chat
  };

  const handleChatBot = () => {
    // Trigger the AI Chatbot functionality (You can integrate your chatbot here)
    alert("Opening AI Chatbot..."); // Replace with your chatbot integration
  };

  return (
    <footer className="footer mt-5">
      <div className="container py-5">
        <div className="row">
          {/* Explore Section */}
          <div className="col-md-3">
            <h5 className="fw-bold">Explore</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/tour-packages" className="footer-link">
                  Tour Packages
                </Link>
              </li>
              <li>
                <Link to="/destinations" className="footer-link">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/getaways" className="footer-link">
                  Getaways
                </Link>
              </li>
              <li>
                <Link to="/cabs" className="footer-link">
                  Cabs
                </Link>
              </li>
              <li>
                <Link to="/hotels" className="footer-link">
                  Hotels
                </Link>
              </li>
              <li>
                <Link to="/blog" className="footer-link">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Themes Section */}
          <div className="col-md-3">
            <h5 className="fw-bold">Themes</h5>
            <ul className="list-unstyled">
              {themes?.map((theme, index) => (
                <li key={index}>
                  <Link to={`/themes/${theme.toLowerCase()}`} className="footer-link">
                    {theme}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Packages Section */}
          <div className="col-md-3">
            <h5 className="fw-bold">Top Packages</h5>
            <ul className="list-unstyled">
              {topPackages?.map((pkg, index) => (
                <li key={index}>
                  <Link to={`/packages/${pkg.toLowerCase()}`} className="footer-link">
                    {pkg} Packages
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* International Section */}
          <div className="col-md-3">
            <h5 className="fw-bold">International</h5>
            <ul className="list-unstyled">
              {internationalDestinations?.map((destination, index) => (
                <li key={index}>
                  <Link to={`/international/${destination.toLowerCase()}`} className="footer-link">
                    {destination}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">
            &copy; 2015 - {currentYear} Tripzy Vacations Pvt Ltd. All Photos from flickr.
          </p>

          {/* Social Media Icons */}
          <div className="social-icons d-flex gap-3">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="footer-icon">
              <FontAwesomeIcon icon={faFacebook} size="lg" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="footer-icon">
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="footer-icon">
              <FontAwesomeIcon icon={faTwitter} size="lg" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-icon">
              <FontAwesomeIcon icon={faInstagram} size="lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Right Side Corner Floating Icons */}
      <div className="floating-icons">
        <div className="icon" onClick={handleCall} title="Call">
          <FontAwesomeIcon icon={faPhone} size="lg" />
        </div>
        <div className="icon" onClick={handleWhatsApp} title="WhatsApp">
          <FontAwesomeIcon icon={faWhatsapp} size="lg" style={{ color: "#25D366" }} />
        </div>
        <div className="icon" onClick={handleChatBot} title="Chatbot">
          <FontAwesomeIcon icon={faCommentDots} size="lg" />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
