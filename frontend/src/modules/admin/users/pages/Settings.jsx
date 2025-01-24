import React, { useState, useEffect } from "react";
import { useComponentName } from "../../../../hooks/ComponentnameContext";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { useUser } from "../../../../hooks/UserContext";
import AlertMessage from "../../reusableComponents/AlertMessage";
import {updateUserById,fetchUserById} from "../../services/ApiService";


const Settings = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: [],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState([]);
  const [editingField, setEditingField] = useState(null); // Track which field is being edited
  const { setComponentName } = useComponentName();
  const { user } = useUser();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setComponentName("Settings");
  }, [setComponentName]);

  useEffect(() => {
    const fetchUserData = async () => {
      try { 
        const response = await fetchUserById(user.userId);
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, [user.userId]);

  const handleDoubleClick = (field) => {
    setEditingField(field); // Set the current field being edited
    setEditedValue(userData[field]); // Set the current value for that field
    setIsEditing(true); // Enable editing mode
  };

  const handleSave = async (field) => {
    setStatus("");
    setMessage("");
    setShowAlert(false);
    try {
      const updatedData = { ...userData, [field]: editedValue };
      const response = await updateUserById(user.userId,updatedData);
      if (response && response.status === 201) {
        setUserData(updatedData); // Update state with the new data
        setStatus("success");
        setMessage("User updated successfully!");
        setShowAlert(true); // Show success alert
      } else {
        setStatus("error");
        setMessage("Failed to update user.");
        setShowAlert(true); // Show error alert
      }
      setIsEditing(false);
      setEditingField(null); // Clear the field being edited
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong!");
      setShowAlert(true); // Show error alert
      console.error("Error updating data:", error);
    }
  };

  const handleChange = (e) => {
    setEditedValue(e.target.value); // Update the value as the user types
  };

  // Tooltip component for each editable field
  const renderTooltip = (text) => <Tooltip id="tooltip">{text}</Tooltip>;

  return (
    <Container>
      {showAlert && (
        <AlertMessage type={status} message={message} show={showAlert} />
      )}
      <Row className="mt-5">
        <Col md={8} className="offset-md-2">
          <Card className="shadow-sm rounded-lg">
            <Card.Header
              className="text-white text-center py-3"
              style={{ backgroundColor: "#ef156c" }}
            >
              <h4>Settings</h4>
            </Card.Header>
            <Card.Body>
              <div className="d-flex flex-column gap-3">
                {/* Username */}
                <div className="d-flex justify-content-between align-items-center">
                  <label className="fs-5 text-secondary">Username:</label>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(
                      "Double Click to edit your username"
                    )}
                  >
                    <span
                      onDoubleClick={() => handleDoubleClick("username")}
                      className="d-inline-block fs-6"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {editingField === "username" ? (
                        <Form.Control
                          type="text"
                          value={editedValue}
                          onChange={handleChange}
                          onBlur={() => handleSave("username")}
                          className="shadow-sm"
                        />
                      ) : (
                        <span style={{ color: "#ef156c" }}>
                          {userData.username}
                        </span>
                      )}
                    </span>
                  </OverlayTrigger>
                </div>

                {/* Email */}
                <div className="d-flex justify-content-between align-items-center">
                  <label className="fs-5 text-secondary">Email:</label>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Double Click to edit your email")}
                  >
                    <span
                      onDoubleClick={() => handleDoubleClick("email")}
                      className="d-inline-block fs-6"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {editingField === "email" ? (
                        <Form.Control
                          type="email"
                          value={editedValue}
                          onChange={handleChange}
                          onBlur={() => handleSave("email")}
                          className="shadow-sm"
                        />
                      ) : (
                        <span style={{ color: "#ef156c" }}>
                          {userData.email}
                        </span>
                      )}
                    </span>
                  </OverlayTrigger>
                </div>

                {/* Phone Number */}
                <div className="d-flex justify-content-between align-items-center">
                  <label className="fs-5 text-secondary">Phone Number:</label>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(
                      "Double Click to edit your phone number"
                    )}
                  >
                    <span
                      onDoubleClick={() => handleDoubleClick("phoneNumber")}
                      className="d-inline-block fs-6"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {editingField === "phoneNumber" ? (
                        <Form.Control
                          type="text"
                          value={editedValue}
                          onChange={handleChange}
                          onBlur={() => handleSave("phoneNumber")}
                          className="shadow-sm"
                        />
                      ) : (
                        <span style={{ color: "#ef156c" }}>
                          {userData.phoneNumber}
                        </span>
                      )}
                    </span>
                  </OverlayTrigger>
                </div>

                {/* Password */}
                <div className="d-flex justify-content-between align-items-center">
                  <label className="fs-5 text-secondary">Password:</label>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip(
                      "Double Click to edit your password"
                    )}
                  >
                    <span
                      onDoubleClick={() => handleDoubleClick("password")}
                      className="d-inline-block fs-6"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {editingField === "password" ? (
                        <Form.Control
                          type="password"
                          value={editedValue}
                          onChange={handleChange}
                          onBlur={() => handleSave("password")}
                          className="shadow-sm"
                        />
                      ) : (
                        <span style={{ color: "#ef156c" }}>********</span>
                      )}
                    </span>
                  </OverlayTrigger>
                </div>

                {/* Role */}
                <div className="d-flex justify-content-between align-items-center">
                  <label className="fs-5 text-secondary">Role:</label>
                  <OverlayTrigger
                    placement="top"
                    overlay={renderTooltip("Double Click to edit your roles")}
                  >
                    <span
                      onDoubleClick={() => handleDoubleClick("role")}
                      className="d-inline-block fs-6"
                      style={{ cursor: "pointer", color: "#007bff" }}
                    >
                      {editingField === "role" ? (
                        <Form.Control
                          as="select"
                          value={editedValue}
                          onChange={handleChange}
                          onBlur={() => handleSave("role")}
                          multiple
                          className="shadow-sm"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="vendor">Vendor</option>
                          <option value="affiliate">Affiliate</option>
                        </Form.Control>
                      ) : (
                        <span style={{ color: "#ef156c" }}>
                          {userData?.role?.join(", ") || " "}{" "}
                          {/* Display roles as a comma-separated list */}
                        </span>
                      )}
                    </span>
                  </OverlayTrigger>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
