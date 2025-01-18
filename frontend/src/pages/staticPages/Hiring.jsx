import React, { useState } from "react";
import Nature from "../../images/spring.jpg";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap

const Hiring = () => {
  const positions = [
    {
      title: "Software Engineer",
      details: (
        <div>
          <p>
            <strong>Job Title:</strong> Software Engineer – TravelNeeds
          </p>
          <p>
            <strong>Location:</strong> Remote / On-site
          </p>
          <p>
            <strong>Employment Type:</strong> Full-Time
          </p>
          <p>
            <strong>Experience Level:</strong> 2+ Years
          </p>
        </div>
      ),
    },
    {
      title: "Frontend Developer",
      details: (
        <div>
          <p>
            <strong>Job Title:</strong> Frontend Developer – TravelNeeds
          </p>
          <p>
            <strong>Location:</strong> Work from Anywhere / On-site
          </p>
          <p>
            <strong>Employment Type:</strong> Full-Time
          </p>
          <p>
            <strong>Experience Level:</strong> 3+ Years
          </p>
        </div>
      ),
    },
    {
      title: "Business Analyst",
      details: (
        <div>
          <p>
            <strong>Job Title:</strong> Business Analyst{" "}
          </p>
          <p>
            <strong>Location:</strong> Remote / On-site
          </p>
          <p>
            <strong>Employment Type:</strong> Full-Time
          </p>
          <p>
            <strong>Experience Level:</strong> 2.5+ Years
          </p>
        </div>
      ),
    },
    {
      title: "Travel Consultant",
      details: (
        <div>
          <ul>
            <p>
              <strong>Experience: </strong>Ideally, at least 2-3 years in travel
              planning, either as part of a travel agency or freelance.
            </p>
          </ul>
          <ul>
            <p>
              <strong>Certifications: </strong>Look for certifications from
              organizations like the American Society of Travel Advisors (ASTA)
              or the International Air Transport Association (IATA).
            </p>
          </ul>
          <ul>
            <p>
              <strong>Languages: </strong>Proficiency in multiple languages can
              be an asset, especially for international travel.
            </p>
          </ul>
        </div>
      ),
    },
  ];

  // State to manage which dropdown is open
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleDropdown = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Hiring</h4>
      </div>
      <hr />
      <div className="hero-imageH">
        <img
          src={Nature}
          className="img-fluid hero-image mb-3 col-12"
          style={{ height: "60vh" }}
          alt="Nature"
        />
      </div>

      {/* Openings Section */}
      <section className="openings-section py-5">
        <div className="container">
          <h2 className="text-center mb-4">Current Openings</h2>
          <div>
            {positions.map((position, index) => (
              <div key={index} className="">
               <div className="d-flex justify-content-center w-100">
               <button
                  className="accordion btn  w-100 text-start text-decoration-none"
                  style={{ color: "#ef156c" }}
                  onClick={() => toggleDropdown(index)}
                >
                  {position.title}
                </button>
                  <span  onClick={() => toggleDropdown(index)} style={{cursor:"pointer"}}>{activeIndex === index ? "▲" : "▼"}</span>
               </div>
                {activeIndex === index && (
                  <div className="panel mt-2 p-3 border bg-light">
                    <p>{position.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="build-future mt-5 text-center">
            <h3>Let’s Build Your Future Together!</h3>
            <p>
              At Travelers needs, we believe in transforming passion into
              purpose. Join us, and let’s inspire the world to explore,
              discover, and create memories.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hiring;
