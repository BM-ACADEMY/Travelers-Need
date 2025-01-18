import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const CollapsibleSection = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="card my-3">
      <div
        className="card-header d-flex justify-content-between align-items-center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
      >
        <h5 className="mb-0">{title}</h5>
        <button
          className="btn  text-decoration-none"
          style={{ color: "#ef156c" }}
        >
          {isOpen ? "-" : "+"}
        </button>
      </div>
      {isOpen && <div className="card-body">{content}</div>}
    </div>
  );
};

const BookingPolicy = () => {
  const sections = [
    {
      title: "Hotel Rooms, Check-in, Breakfast Related",
      content: (
        <ul>
          <li>
            Standard Hotel check-in time is usually between 12 PM - 2 PM &
            check-out time is between 10 AM to 12 PM. Early check-in is subject
            to availability & hotel may charge extra (not included in the tour
            price). In case of late check-in, please inform the hotel about your
            arrival time.
          </li>
          <li>
            Hotel rooms are provided on a twin-sharing basis. In case of 3
            adults, a 3-sharing room with an extra mattress (on floor) will be
            provided.
          </li>
        </ul>
      ),
    },
    {
      title: "Payment Schedule",
      content: (
        <p>
          Pay in full or opt for our flexible installment plans (where
          available) to make your trip more affordable. Secure payment options
          include credit cards, debit cards, and trusted online gateways. We
          prioritize your safety with encrypted transactions. Prices are listed
          and may include additional taxes or fees at checkout.
        </p>
      ),
    },
    {
      title: "Vehicle Category, Pickup Related",
      content: (
        <p>
          We offer a wide range of vehicles, including sedans, SUVs, and
          minivans, to suit your travel needs. Enjoy seamless pickup and
          drop-off services at airports, hotels, or custom locations with
          professional, punctual drivers. All vehicles are air-conditioned,
          well-maintained, and equipped for safety and comfort. Please confirm
          your pickup time and location during booking; additional charges may
          apply for late-night or special requests.
        </p>
      ),
    },
    {
      title: "Sightseeing Related",
      content: (
        <p>
          Sightseeing is the activity of exploring notable attractions, whether
          historical landmarks, natural wonders, or cultural sites. It includes
          visiting famous monuments like the Eiffel Tower or Taj Mahal, hiking
          scenic trails, exploring museums, or experiencing local markets and
          cuisine. From urban adventures to tranquil nature escapes, sightseeing
          allows you to immerse in the history, culture, and beauty of a
          destination, offering enriching experiences for every traveler.
        </p>
      ),
    },
    {
      title: "Miscellaneous Terms",
      content: (
        <ul>
          <li>
            <strong>Itinerary:</strong> A planned route or schedule of a trip.
          </li>
          <li>
            <strong>Landmark:</strong> A notable, historically significant site.
          </li>
          <li>
            <strong>Tourism:</strong> Traveling for pleasure, exploring new
            destinations.
          </li>
          <li>
            <strong>Backpacking:</strong> Budget travel with a focus on
            flexibility and adventure.
          </li>
          <li>
            <strong>Off-the-beaten-path:</strong> Less crowded, unique travel
            destinations.
          </li>
          <li>
            <strong>Adventure Travel:</strong> Travel involving physical
            activities and exploration.
          </li>
        </ul>
      ),
    },
    {
      title:
        "All payments for International tours to be made in USD unless mentioned in other currency",
      content: (
        <p>
          For all international tours, payments should be made in USD, unless
          specified otherwise in INR or another currency. This makes it clear
          that USD is the preferred currency for international tours, while also
          allowing flexibility if another currency is mentioned.
        </p>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Booking Policy </h4>
      </div>
      <hr />
      {sections.map((section, index) => (
        <CollapsibleSection
          key={`${section.title}-${index}`}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  );
};

export default BookingPolicy;
