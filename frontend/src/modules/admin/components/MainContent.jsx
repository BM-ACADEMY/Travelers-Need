// src/components/MainContent.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Booking from '../pages/Booking';
import Places from '../pages/Places';
import Feedback from '../pages/Feedback'
import TourPackages from '../pages/TourPackages'

const MainContent = () => {
  return (
    <div className="flex-grow-1 p-4">
      {/* Dynamic Page Content */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/places" element={<Places />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/tourPackages" element={<TourPackages />} />
      </Routes>
    </div>
  );
};

export default MainContent;
