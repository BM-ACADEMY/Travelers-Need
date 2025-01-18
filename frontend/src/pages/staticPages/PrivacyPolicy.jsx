import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const PrivacyPolicy = () => {
  return (
    <div>
      {/* Content */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Privacy Policy</h4>
      </div>
      <hr />
      <main className="container d-flex gap-3 flex-column">
    
        <span>
          Travelers need , Our is committed to protecting your privacy. This
          Privacy Policy outlines how we collect, use, disclose, and safeguard
          your information when you visit our website and use our services. By
          accessing or using our website, you agree to the practices described
          in this policy.
        </span>

        <h4 style={{ color: "#ef156c" }}>Information We Collect:</h4>
        <ul>
          <li>
            <b>Personal Information:</b> Name, email address, phone number,
            payment details, passport information, and travel preferences.
          </li>
          <li>
            <b>Non-Personal Information:</b> Browser type, IP address, cookies,
            and other technical data to improve your user experience.
          </li>
          <li>
            <b>Third-Party Information:</b> Information from social media
            platforms or other third parties when you interact with us through
            those channels.
          </li>
        </ul>

        <h4 style={{ color: "#ef156c" }}>How We Use Your Information?</h4>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process bookings, payments, and travel arrangements.</li>
          <li>
            Provide personalized travel recommendations and customer support.
          </li>
          <li>Send updates, promotions, and newsletters.</li>
          <li>Improve our website’s functionality and user experience.</li>
          <li>
            Comply with legal requirements and prevent fraudulent activities.
          </li>
        </ul>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
