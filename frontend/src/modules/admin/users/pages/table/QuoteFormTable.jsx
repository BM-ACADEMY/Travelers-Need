import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import {fetchAllQuotesForAdminPage} from "../../../services/ApiService";
const QuoteFormTable = ({ onUpdate }) => {
  const [quotes, setQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("today");
  const [quoteToDelete, setQuoteToDelete] = useState(null);
  const [quoteToEdit, setQuoteToEdit] = useState(null);
  const [newQuoteData, setNewQuoteData] = useState({
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    duration: "",
  });

  useEffect(() => {
    // Fetch quotes based on search term, filter, and pagination
    const fetchQuotes = async () => {
      try {
        const response =  fetchAllQuotesForAdminPage(
                currentPage,
                searchTerm,
                filter
              );
        
        setQuotes(response.data.quotes);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching quotes:", error);
      }
    };

    fetchQuotes();
  }, [currentPage, searchTerm, filter]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search change
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleEdit = async (quote) => {
    setQuoteToEdit(quote);
    setNewQuoteData({ ...quote });
    // Handle the editing logic here
  };

  const handleDelete = async (quoteId) => {
    try {
      // await axios.delete(`http://localhost:3000/api/quotes/${quoteId}`);
      // Re-fetch the quotes after deletion
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <div className="d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search by username"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <select
            className="form-select"
            value={filter}
            onChange={handleFilterChange}
          >
            <option value="today">Today</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Phone</th>
            <th>Destination</th>
            <th>Start Date</th>
            <th>Duration</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote._id}>
              <td>{quote.email}</td>
              <td>{quote.phone}</td>
              <td>{quote.destination}</td>
              <td>{quote.startDate}</td>
              <td>{quote.duration}</td>
              <td>
                <Button variant="primary" onClick={() => onUpdate(quote)}>
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(quote._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default QuoteFormTable;
