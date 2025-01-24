import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Modal, Form } from "react-bootstrap";
import axios from "axios";
import moment from "moment";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
import AlertMessage from "../../reusableComponents/AlertMessage";
import {
  deleteQuote,
  updateQuoteStatus,
  updateQuote,
  createQuote,
  fetchAllQuotesForAdminPage,
} from "../../services/ApiService";

const formatDuration = (duration) => {
  const days = duration;
  const nights = duration > 1 ? duration - 1 : 0;
  return `${days} Days / ${nights} Night${nights !== 1 ? "s" : ""}`;
};

const Support = () => {
  const [quotes, setQuotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { setComponentName } = useComponentName();

  useEffect(() => {
    setComponentName("Customer Support");
  }, [setComponentName]);
  const [newQuote, setNewQuote] = useState({
    email: "",
    phone: "",
    destination: "",
    startDate: "",
    duration: "",
  });

  // Fetch quotes
  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const response = await fetchAllQuotesForAdminPage(
        currentPage,
        searchTerm,
        filter
      );
      setQuotes(response.data.quotes);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [currentPage, searchTerm, filter]);

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setCurrentPage(1);
  };

  // Open add modal
  const handleAddModal = () => {
    setNewQuote({
      email: "",
      phone: "",
      destination: "",
      startDate: "",
      duration: "",
    });
    setShowAddModal(true);
  };

  // Add a new quote
  const addQuote = async () => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      setLoading(true);

      const response = await createQuote(newQuote);
      if (response && response.status === 201) {
        fetchQuotes();
        setLoading(false);
        setStatus("success");
        setMessage("Quote Created successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to save Quote!");
        setShowAlert(true); // Show error alert
      }
      setQuotes((prev) => [response.data, ...prev]);
      setShowAddModal(false);
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error adding quote:", error);
    }
  };

  // Handle field changes in add modal
  const handleFieldChange = (e) => {
    setNewQuote({ ...newQuote, [e.target.name]: e.target.value });
  };

  // Open delete modal
  const handleDeleteModal = (quote) => {
    setSelectedQuote(quote);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    if (selectedQuote) {
      try {
        setLoading(true);
        const response = await deleteQuote(selectedQuote._id);
        if (response && response.status === 201) {
          setLoading(false);
          setStatus("success");
          setMessage("Quote Deleted successfully!");
          setShowAlert(true); // Show success alert
        } else {
          setLoading(false);
          setStatus("error");
          setMessage("Failed to Delete Quote!");
          setShowAlert(true); // Show error alert
        }
        setQuotes((prev) => prev.filter((q) => q._id !== selectedQuote._id));
        setShowDeleteModal(false);
      } catch (error) {
        setLoading(false);
        setStatus("error", error);
        setMessage("Something went wrong!");
        setShowAlert(true); // Show error alert
        console.error("Error deleting quote:", error);
      }
    }
  };

  // Open edit modal
  const handleEditModal = (quote) => {
    setSelectedQuote(quote);
    setShowEditModal(true);
  };

  // Confirm edit
  const confirmEdit = async () => {
    setStatus("");
    setMessage("");
    setShowAlert(false);

    try {
      setLoading(true);
      const response = await updateQuote(selectedQuote._id, selectedQuote);
      if (response && response.status === 201) {
        setLoading(false);
        fetchQuotes();
        setStatus("success");
        setMessage("Quote updated successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to Update Quote!");
        setShowAlert(true); // Show error alert
      }
      setQuotes((prev) =>
        prev.map((q) => (q._id === response.data._id ? response.data : q))
      );
      setShowEditModal(false);
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error updating quote:", error);
    }
    1;
  };
  const handleStatusChange = async (quoteId, newStatus) => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      setLoading(true);
     const response= await updateQuoteStatus(quoteId, {status:newStatus});

      if (response && response.status === 201) {
        setLoading(false);
        fetchQuotes();
        setStatus("success");
        setMessage("Quote updated successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setLoading(false);
        setStatus("error");
        setMessage("Failed to Update !");
        setShowAlert(true); // Show error alert
      }
    } catch (error) {
      setLoading(false);
      setStatus("error", error);
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          marginLeft: "5px",
          padding: "8px",
          backgroundColor: "#ef156c",
          color: "white",
          fontSize: "15px",
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    );
  }
  return (
    <div>
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      {/* Add Quote Button */}
      <Button variant="success" className="mb-3" onClick={handleAddModal}>
        Add Quote
      </Button>

      {/* Search and Filter */}
      <div className="mb-3 d-flex">
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
          <option value="">All</option>
          <option value="today">Today</option>
          <option value="lastWeek">Last Week</option>
          <option value="lastMonth">Last Month</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Phone</th>
            <th>Destination</th>
            <th>Start Date</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((quote) => (
            <tr key={quote._id}>
              <td>{quote.email}</td>
              <td>{quote.phone}</td>
              <td>{quote.destination}</td>
              <td>{new Date(quote.startDate).toLocaleDateString("en-US")}</td>
              <td>{formatDuration(quote.duration)}</td>
              <td>
                <span
                  className={`badge ${
                    quote.status === "pending" ? "bg-warning" : "bg-success"
                  }`}
                >
                  {quote.status}
                </span>
              </td>
              <td>
                <div className="d-flex gap-1">
                  <Button
                    variant="primary"
                    onClick={() => handleEditModal(quote)}
                  >
                    Edit
                  </Button>{" "}
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteModal(quote)}
                  >
                    Delete
                  </Button>{" "}
                  <Form.Control
                    as="select"
                    value={quote.status}
                    onChange={(e) =>
                      handleStatusChange(quote._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </Form.Control>
                </div>
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

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newQuote.email}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={newQuote.phone}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={newQuote.destination}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={newQuote.startDate}
                onChange={handleFieldChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={newQuote.duration}
                onChange={handleFieldChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={addQuote}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this quote?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Quote</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={selectedQuote?.email || ""}
                onChange={(e) =>
                  setSelectedQuote({ ...selectedQuote, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={selectedQuote?.phone || ""}
                onChange={(e) =>
                  setSelectedQuote({ ...selectedQuote, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={selectedQuote?.destination || ""}
                onChange={(e) =>
                  setSelectedQuote({
                    ...selectedQuote,
                    destination: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="startDate"
                value={
                  selectedQuote?.startDate
                    ? moment(selectedQuote.startDate).format("YYYY-MM-DD")
                    : ""
                }
                onChange={(e) =>
                  setSelectedQuote({
                    ...selectedQuote,
                    startDate: moment(e.target.value).format("YYYY-MM-DD"),
                  })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Duration</Form.Label>
              <Form.Control
                type="text"
                name="duration"
                value={selectedQuote?.duration || ""}
                onChange={(e) =>
                  setSelectedQuote({
                    ...selectedQuote,
                    duration: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Support;
