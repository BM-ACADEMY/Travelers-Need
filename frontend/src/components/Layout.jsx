import React,{useEffect,useState} from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import {fetchAllAddressesTourType} from "../modules/admin/services/ApiService";
const Layout = () => {
  const themes = ["Honeymoon", "HillStations", "Wildlife", "Pilgrimage", "Beach", "Heritage"];
  // const topPackages = ["Coorg", "Ooty", "Goa", "Shimla", "Pondicherry", "Mahabaleshwar", "Chikmagalur"];
  // const internationalDestinations = ["Sri Lanka", "Thailand", "Bali", "Dubai", "Singapore"];
  const pages = [
    { title: "About Us", link: "/about-us" },
    { title: "Contact Us", link: "/contact-us" },
    { title: "Reviews", link: "/reviews" },
    { title: "FAQ", link: "/faq" },
    { title: "Booking Policy", link: "/booking-policy" },
    { title: "Hiring", link: "/hiring" },
    { title: "Travel Agents & Affiliates", link: "/travel-agents-affiliate" },
    { title: "Privacy Policy", link: "/privacy-policy" },
    { title: "Terms & Conditions", link: "/terms-conditions" },
  ];
  const [topPackages, setTopPackages] = useState([]);
    const [internationalDestinations, setInternationalDestinations] = useState(
      []
    );
    const [error, setError] = useState(null);
    useEffect(() => {
      const fetchDestinations = async () => {
        try {
          const response = await fetchAllAddressesTourType();
          const { domestic, international } = response.data.addresses;
  
          setTopPackages(domestic);
          setInternationalDestinations(international);
        } catch (err) {
          console.error("Error fetching destinations:", err);
          setError("Failed to load destinations. Please try again later.");
        }
      };
  
      fetchDestinations();
    }, []);
  return (
    <div className="d-flex bg-white flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1 scrollable-main">
        <Outlet />
      </main>
      <Footer
        themes={themes}
        topPackages={topPackages}
        internationalDestinations={internationalDestinations}
        pages={pages}
      />
    </div>
  );
};
export default Layout;
