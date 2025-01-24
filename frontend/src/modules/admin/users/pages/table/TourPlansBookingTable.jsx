import React, { useState, useEffect } from "react";

import BookingModal from "../model/BookingModel";

const formatDuration = (duration) => {
  const days = duration;
  const nights = duration > 1 ? duration - 1 : 0;
  return `${days} Days / ${nights} Night${nights !== 1 ? "s" : ""}`;
};

const TourPlansBookingTable = ({ packages }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(packages);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packageId, setPackageId] = useState(null);

  const handleShowModal = (baseFare, packageId) => {
    setSelectedPackage(baseFare);
    setPackageId(packageId);
    setShowModal(true); // Show the modal
  };
  const recordsPerPage = 5;
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const VITE_GET_IMAGE_FOR_TOUR_PLAN = import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN.startsWith(
    "http"
  )
    ? import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_TOUR_PLAN}`;

  const generateImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg";
    const [tourCode, fileName] = imagePath.split("\\");
    return `${VITE_GET_IMAGE_FOR_TOUR_PLAN}?tourCode=${encodeURIComponent(
      tourCode?.toLowerCase() || ""
    )}&fileName=${encodeURIComponent(fileName || "")}`;
  };
  // Filter the data based on search term
  useEffect(() => {
    console.log(packages);

    const filtered = packages.filter((pkg) =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to the first page on new search
  }, [searchTerm, packages]);

  // Pagination logic
  const totalRecords = filteredData?.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedData = filteredData?.slice(startIndex, endIndex);

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <hr />
      <div className="mb-3 mt-3">
        <h4 style={{ color: "#ef156c" }}>Booking Section</h4>
      </div>
      {/* Search Input */}
      <div className="d-flex justify-content-between align-items-center mb-3 mt-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered table-hover">
          <thead>
            <tr>
              <th>Tour Code</th>
              <th>Title</th>
              <th>Base Fare</th>
              <th>Duration</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>{item.tourCode}</td>
                  <td>{item.title}</td>
                  <td>₹{item.baseFare.toLocaleString()}</td>
                  <td>{formatDuration(item.duration)}</td>
                  <td>
                    <img
                      src={generateImageUrl(item.images[0])}
                      alt={item.title}
                      style={{
                        width: "100px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      onError={(e) => (e.target.src = "placeholder.jpg")}
                    />
                  </td>
                  <td>
                    <button
                      className="btn btn-success"
                      onClick={() => handleShowModal(item.baseFare, item._id)}
                    >
                      Book Now
                    </button>
                    {showModal && selectedPackage === item.baseFare && (
                      <BookingModal
                        show={showModal}
                        baseFare={selectedPackage}
                        packageId={packageId}
                        onClose={() => setShowModal(false)}
                      />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Open BookingModal if showModal is true */}

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <span>
            <strong>Total Records: </strong>
            {filteredData.length}
          </span>
        </div>
        {/* Pagination Controls */}
        <nav>
          <ul className="pagination">
            <li className="page-item">
              <button
                className="page-link"
                onClick={handlePrevious}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  index + 1 === currentPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li className="page-item">
              <button
                className="page-link"
                onClick={handleNext}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default TourPlansBookingTable;
