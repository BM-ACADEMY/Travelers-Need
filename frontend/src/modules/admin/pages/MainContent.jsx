import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Booking from "./Booking";
import Places from "./Places";

function MainContent() {
  return (
    <div style={{ paddingLeft: "250px", paddingTop: "64px" }}>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Booking />} />
          <Route path="/users" element={<Places />} />
        </Routes>
      </Suspense>
    </div>
  );
}
export default MainContent;
