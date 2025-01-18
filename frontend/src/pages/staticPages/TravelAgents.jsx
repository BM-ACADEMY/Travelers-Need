import React from "react";
import Travel from "../../images/Travel-Agents.png";

const TravelAgents = () => {
  return (
    <div className="">
      {/* Hero Section */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Travel Agents</h4>
      </div>
      <hr />
      <div className="text-center my-4">
        <img
          src={Travel}
          alt="Travel Agent"
          className="img-fluid hero-image mb-3 col-12"
          style={{ height: "70vh" }}
        />
        <h3 className="mt-3" style={{ color: "#ef156c" }}>
          Book Tours as Travel Agent & Earn up to ₹2000 on Every Tour Booking
        </h3>
      </div>

      {/* Information Section */}
      <div className="row my-5">
        <div className="col-md-6 mb-4">
          <div className="p-3 border rounded shadow-sm">
            <h2>What is Partner Program?</h2>
            <p>
              Travelers need Partner Program is intended to provide an
              opportunity to travel agents to arrange trips across India to
              their local clients. Content creators (bloggers / YouTubers) can
              also use Partner Program to generate referral links for tours.
            </p>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="p-3 border rounded shadow-sm">
            <h2>Why Travelers need?</h2>
            <p>
              Travelers need is one of the top-rated tour operators with over 8
              years experience in operating private tours across India and
              abroad with high focus and quality. It offers top hotels in each
              category and provides reliable and verified drivers.
            </p>
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="bg-light p-4">
        <h3 style={{ color: "#ef156c" }}>
          Join Us and Expand Your Travel Business!
        </h3>
        <h4 className="text-secondary">Why Partner with TravelersNeeds?</h4>
        <p>
          At TravelersNeeds, we connect passionate travelers with trusted travel
          agents like you. As a partner, you'll gain access to a global audience
          and simplify your operations. Here’s why you should join us:
        </p>
        <ul className="list-unstyled">
          <li>
            <strong>Reach More Travelers: </strong>Showcase your services to
            thousands of potential customers searching for their next adventure.
          </li>
          <li>
            <strong>Boost Your Visibility: </strong>Leverage our platform to
            enhance your online presence and stand out from the competition.
          </li>
          <li>
            <strong>Increase Your Bookings: </strong>Seamlessly connect with
            travelers ready to plan their dream trips.
          </li>
          <li>
            <strong>Comprehensive Tools: </strong>Use our easy-to-navigate
            dashboard to manage inquiries, bookings, and customer communication.
          </li>
        </ul>

        <h3 style={{ color: "#ef156c" }}>Who Can Join?</h3>
        <p>We welcome:</p>
        <ul className="list-unstyled">
          <li>
            Travel agents and consultants offering customized travel packages.
          </li>
          <li>Tour operators with unique itineraries and experiences.</li>
          <li>Destination specialists with local expertise.</li>
          <li>Corporate travel planners.</li>
        </ul>

        <h3 style={{ color: "#ef156c" }}>How It Works</h3>
        <ol>
          <li>
            <strong>Sign Up: </strong>Complete our simple registration process.
          </li>
          <li>
            <strong>Showcase Your Services: </strong>Create your profile,
            highlight your expertise, and list your travel packages.
          </li>
          <li>
            <strong>Connect with Travelers: </strong>Respond to inquiries, offer
            quotes, and finalize bookings.
          </li>
        </ol>

        <h3 style={{ color: "#ef156c" }}>Benefits of Joining Us</h3>
        <ul className="list-unstyled">
          <li>
            <strong>No Upfront Fees: </strong>We offer flexible partnership
            models to suit your needs.
          </li>
          <li>
            <strong>Trusted Platform: </strong>TravelersNeeds is a name
            travelers trust for reliability and quality.
          </li>
        </ul>

        <h3 style={{ color: "#ef156c" }}>Start Your Journey Today!</h3>
        <p>
          Join a community of travel agents dedicated to creating unforgettable
          travel experiences. Sign up now and let’s build a better future for
          travel together!
        </p>
        <button className="btn btn-warning text-dark">Register Now</button>

        <p className="mt-4">
          For more details, contact us at{" "}
          <a href="mailto:partners@travelersneeds.com" className="text-primary">
            partners@travelersneeds.com
          </a>{" "}
          or call us at +91-994-494-0051.
        </p>
      </div>
    </div>
  );
};

export default TravelAgents;
