import React from 'react';
import cont from '../../images/contact1.png'; 

const ContactUs = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Contact Us </h4>
      </div>
      <hr />
      <section className="hero">
        <img
          src={cont} // Replace this with your scenic image URL
        //   className="img-fluid hero-image1"
          alt="Hero Image"
          className="img-fluid hero-image mb-3 col-12"
          style={{ height: "60vh" }}
        />
      </section>

      {/* Get in Touch Section */}
      <section className="get-in-touch py-5 bg-white">
        <div className="container text-center">
          <h2 className="h2 mb-4">Get in Touch</h2>
          <p>
            Founded in 2013, Travelers Needs is India’s leading online travel
            marketplace, bringing both the traveler and expert Travel-Agents onto a
            common platform.
          </p>

          <div className="contact-details mt-4">
            <p>📱 994-494-0051</p>
            <p>📧 help@thebmacademy.com</p>
            <p>
              📍 252, 2nd FLOOR, M G ROAD, KOTTAKUPPAM, VANUR TALUK, VILLUPURAM
              DISTRICT.
            </p>
          </div>

          {/* Map Section */}
          <div className="map mt-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3903.195574191156!2d79.8331335750597!3d11.960957188269207!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDU3JzM5LjUiTiA3OcKwNTAnMDguNiJF!5e0!3m2!1sen!2sin!4v1735560715401!5m2!1sen!2sin"
              className="w-100"
              style={{ height: '250px', border: 'none' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map Location"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactUs;
