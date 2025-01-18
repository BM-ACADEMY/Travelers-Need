import React, { useEffect, useState } from "react";
import { Modal, Table, Button, Row, Col, Form } from "react-bootstrap";
import {
  fetchUsersData,
  fetchUserByIdData,
  createUserData,
  updateUserData,
  deleteUserData,
} from "../../services/ApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrash,
  faPlus,
  faSyncAlt,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import AlertMessage from "../../reusableComponents/AlertMessage";
import "../../users/pages/Travelers.css";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
const Travelers = () => {
  const [users, setUsers] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [usernameToDelete, setUsernameToDelete] = useState("");
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const { setComponentName } = useComponentName();

  useEffect(() => {
    // Set the component name dynamically when this component is loaded
    setComponentName("Travelers");
  }, [setComponentName]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: [], // This will store the selected roles
  });
  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetchUsersData(page, search, "username"); // Pass sorting param as needed
        setUsers(response.data.users);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching users", error);
      }
    };
    getUsers();
  }, [page, search]);
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role: "", // Error for role selection
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validateForm(name, value); // Call validation on each field change
  };

  const handleRoleChange = (e) => {
    const { options } = e.target;
    const selectedRoles = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    setFormData({
      ...formData,
      role: selectedRoles,
    });

    validateForm("role", selectedRoles); // Validate role selection
  };

  const fetchUserList = async () => {
    try {
      const response = await fetchUsersData(page, search, "username");
      console.log(response.data); // Log the response to check the format
      if (response && Array.isArray(response.data.users)) {
        setUsers(response.data.users);
      } else {
        console.error("Invalid response format:", response);
        setUsers([]); // Reset to an empty array if the response is not valid
      }
    } catch (error) {
      console.error("Error fetching updated users", error);
      setUsers([]); // Reset to an empty array in case of error
    }
  };

  useEffect(() => {
    fetchUserList();
  }, [page, search]);
  const handleRefresh = () => {
    fetchUserList();
  };
  // Handle form submit (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFormValid()) {
      try {
        setStatus("");
        setMessage("");
        setShowAlert(false);

        let response;

        if (isEditMode) {
          // Update user
          response = await updateUserData(formData._id, formData);
        } else {
          // Create new user
          response = await createUserData(formData);
        }

        // Reset form and modal after success
        setShowModal(false);
        setFormData({
          username: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          role: [],
        });
        setIsEditMode(false);
        setPage(1);
        fetchUserList();

        // Handle response
        if (response && response.status === 201) {
          setStatus("success");
          setMessage(
            isEditMode
              ? "User updated successfully!"
              : "User added successfully!"
          );
          setShowAlert(true); // Show success alert
        } else {
          setStatus("error");
          setMessage("Failed to save user!");
          setShowAlert(true); // Show error alert
        }
      } catch (error) {
        // Handle error
        console.log(error);

        setStatus("error", error);
        setMessage("Something went wrong!");
        setShowAlert(true); // Show error alert
      }
    }
  };

  // Open the modal for create or edit
  const openModal = (user = null) => {
    if (user) {
      setFormData(user);
      setIsEditMode(true);
    } else {
      setFormData({
        username: "",
        email: "",
        phoneNumber: "",
        password: "",
        confirmPassword: "",
        role: "user",
      });
      setIsEditMode(false);
    }
    setShowModal(true);
  };
  const validateForm = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "username":
        if (!value.trim()) {
          newErrors.username = "Username is required.";
        } else if (!/^[A-Za-z]+$/.test(value)) {
          newErrors.username = "Username must contain only alphabets.";
        } else {
          newErrors.username = "";
        }
        break;

      case "email":
        if (!value.trim()) {
          newErrors.email = "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          newErrors.email = "Email is invalid.";
        } else {
          newErrors.email = "";
        }
        break;

      case "phoneNumber":
        if (!value.trim()) {
          newErrors.phoneNumber = "Phone number is required.";
        } else if (!/^\d{10}$/.test(value)) {
          newErrors.phoneNumber = "Phone number must be 10 digits.";
        } else {
          newErrors.phoneNumber = "";
        }
        break;

      case "password":
        if (!value.trim()) {
          newErrors.password = "Password is required.";
        } else if (value.length < 5) {
          newErrors.password = "Password must be at least 5 characters long.";
        } else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/g.test(value)) {
          newErrors.password =
            "Password must contain at least one uppercase letter, one number, and one symbol.";
        } else {
          newErrors.password = "";
        }
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match.";
        } else {
          newErrors.confirmPassword = "";
        }
        break;

      case "role":
        if (value.length === 0) {
          newErrors.role = "At least one role must be selected.";
        } else {
          newErrors.role = "";
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const isFormValid = () => {
    return (
      !Object.values(errors).some((error) => error !== "") &&
      Object.values(formData).every((field) => field !== "")
    );
  };
  // Open delete confirmation modal
  const openDeleteModal = (userId, username) => {
    setUserIdToDelete(userId);
    setUsernameToDelete(username);
    setIsDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      // Reset the progress bar before the API call
      setStatus("");
      setMessage("");
      setShowAlert(false); // Hide alert initially before making API call
      const response = await deleteUserData(userIdToDelete);
      setIsDeleteModalVisible(false);
      setPage(1);
      fetchUserList();

      // Handle the response from the API
      if (response && response.status === 201) {
        setStatus("success");
        setMessage("User deleted successfully!");
        setShowAlert(true); // Show success toast message
      } else {
        setStatus("error");
        setMessage("Failed to delete user!");
        setShowAlert(true); // Show error toast message
      }
    } catch (error) {
      // In case of error, handle the error message
      setStatus("error");
      setMessage("Something went wrong while deleting!");
      setShowAlert(true); // Show error toast message

      console.error("Error deleting user", error);
    }
  };

  const viewUserDetails = async (id) => {
    try {
      const response = await fetchUserByIdData(id);
      setUserDetails(response.data);
      console.log(response);

      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  return (
    <div className="container">
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      {/* Search and Add New User Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        {/* Search Bar */}
        <div className="input-group" style={{ width: "60%" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingRight: "30px" }} // Padding to make room for the icon
          />
          <span className="search-icon">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
        <div className="d-flex gap-2">
          <Button variant="secondary" onClick={handleRefresh}>
            <FontAwesomeIcon icon={faSyncAlt} /> Refresh
          </Button>
          {/* Add New User Icon */}
          <Button
            variant="success"
            onClick={() => openModal()} // Open modal for creating new user
            style={{ marginLeft: "10px" }}
          >
            <FontAwesomeIcon icon={faPlus} /> Add New User
          </Button>
        </div>
      </div>

      {/* User Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.role.join(", ")}</td>
                <td>
                  <div className="d-flex gap-1">
                    <Button
                      variant="info"
                      onClick={() => viewUserDetails(user._id)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View Details
                    </Button>
                    <Button variant="warning" onClick={() => openModal(user)}>
                      <FontAwesomeIcon icon={faEdit} /> Edit
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => openDeleteModal(user._id, user.username)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Pagination */}
      <div className="d-flex justify-content-between">
        <Button
          variant="secondary"
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          variant="secondary"
          onClick={() =>
            setPage((prevPage) => Math.min(prevPage + 1, totalPages))
          }
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>

      {/* Modal for Create/Edit User */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditMode ? "Edit User" : "Create User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col xs={12} md={6}>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                  {errors.username && (
                    <small className="text-danger">{errors.username}</small>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <small className="text-danger">{errors.email}</small>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                  {errors.phoneNumber && (
                    <small className="text-danger">{errors.phoneNumber}</small>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <small className="text-danger">{errors.password}</small>
                  )}
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  {errors.confirmPassword && (
                    <small className="text-danger">
                      {errors.confirmPassword}
                    </small>
                  )}
                </Form.Group>
              </Col>

              {/* Role Selection */}
              <Col xs={12}>
                <Form.Group controlId="formRoles">
                  <Form.Label>Roles</Form.Label>
                  <Form.Select
                    multiple
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="vendor">Vendor</option>
                    <option value="affiliate">Affiliate</option>
                  </Form.Select>
                  {errors.role && (
                    <small className="text-danger">{errors.role}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={isDeleteModalVisible}
        onHide={() => setIsDeleteModalVisible(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user{" "}
          <strong>{usernameToDelete}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalVisible(false)}
          >
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* User Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {userDetails ? (
            <>
              <p>
                <strong>Username:</strong> {userDetails.username}
              </p>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Phone Number:</strong> {userDetails.phoneNumber}
              </p>
              <p>
                <strong>Role:</strong> {userDetails.role}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Travelers;
