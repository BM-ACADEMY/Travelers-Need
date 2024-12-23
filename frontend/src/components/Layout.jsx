import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  const themes = ["Honeymoon", "Hill Stations", "Wildlife", "Pilgrimage", "Beach", "Heritage", "Adventure"];
  const topPackages = ["Coorg", "Ooty", "Goa", "Shimla", "Pondicherry", "Mahabaleshwar", "Chikmagalur"];
  const internationalDestinations = ["Sri Lanka", "Thailand", "Bali", "Dubai", "Singapore"];

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
      />
    </div>
  );
};
export default Layout;
