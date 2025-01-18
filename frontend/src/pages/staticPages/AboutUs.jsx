import React from "react";
import aboutus from "../../images/abt.png";
const AboutUs = () => {
  return (
    <div className=" about-us">
      {/* Hero Section */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>About Us </h4>
      </div>
      <hr />
      <div className="row text-center mb-4">
        <div className="col-12 d-flex flex-column gap-2">
          <img
            src={aboutus}
            alt="Travel landscape"
            className="img-fluid hero-image mb-3 col-12"
            style={{ height: "60vh" }}
          />
          <h2 className="h2 col-12">
            Building the Holiday Eco-system for Happy Travelers
          </h2>
        </div>
      </div>

      {/* Stats Section */}
      <div className="d-flex justify-content-center ">
        <div className="row d-flex justify-content-center  mb-4 container align-content-center p-4" style={{backgroundColor:"#ef156c"}}>
          <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center">
            <h3 className="text-white">20 Lakh+</h3>
            <p className="text-white">Travelers monthly visiting us</p>
          </div>
          <div className="col-12 col-md-4  d-flex flex-column justify-content-center align-items-center">
            <h3 className="text-white">650+</h3>
            <p className="text-white">Network of expert travel agents</p>
          </div>
          <div className="col-12 col-md-4 d-flex flex-column justify-content-center align-items-center">
            <h3 className="text-white">65+</h3>
            <p className="text-white">Destinations served worldwide</p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="row text-center container">
        <div className="col">
          <p className="text-justify">
            At Travelers needs, we are passionate about making your travel
            dreams a reality. Founded on a love for exploration and discovery,
            we specialize in crafting unique, unforgettable travel experiences
            that cater to every kind of traveler. Whether you're seeking a
            peaceful retreat, an action-packed adventure, or a cultural
            immersion, we have the perfect package for you. Whether you're seeking a peaceful retreat, an action-packed
            adventure, or a cultural immersion, we have the perfect package for
            you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
