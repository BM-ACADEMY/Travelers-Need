import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import {updateBlog} from "../../../services/ApiService";

const BlogModal = ({ show, onHide, blog, setBlogs, mode, handleDelete }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    author: "",
    description: "",
    images: [],
    cityDetails: [{ cityName: "", description: "", link: "" }],
  });

  // Populate form data or reset form based on `blog` and `mode`
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title || "",
        date: blog.date || "",
        author: blog.author || "",
        description: blog.description || "",
        images: blog.images || [],
        cityDetails: blog.cityDetails || [{ cityName: "", description: "", link: "" }],
      });
    } else {
      resetForm();
    }
  }, [blog]);

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      author: "",
      description: "",
      images: [],
      cityDetails: [{ cityName: "", description: "", link: "" }],
    });
  };

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (index !== null) {
      const updatedCityDetails = [...formData.cityDetails];
      updatedCityDetails[index][name] = value;
      setFormData({ ...formData, cityDetails: updatedCityDetails });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddCity = () => {
    setFormData((prev) => ({
      ...prev,
      cityDetails: [...prev.cityDetails, { cityName: "", description: "", link: "" }],
    }));
  };

  const handleRemoveCity = (index) => {
    const updatedCityDetails = formData.cityDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, cityDetails: updatedCityDetails });
  };

  const handleSubmit = async () => {
    if (mode === "edit") {
      try {
        const response = await updateBlog(blog._id, formData); // Await the result of the updateBlog function
        // Update the blogs state with the new data
        setBlogs((prev) =>
          prev.map((b) => (b._id === blog._id ? response.data : b))
        );
        onHide(); // Close the modal or perform any other action after success
      } catch (error) {
        console.error("Error updating the blog:", error); // Handle any errors that occur during the API call
      }
    }
  };

  const handleDeleteBlog = () => {
    if (handleDelete && blog) {
      handleDelete(blog._id);
      onHide();
    }
  };

  return (
    <Modal show={show} onHide={onHide} onExited={resetForm}>
      <Modal.Header closeButton>
        <Modal.Title>
          {mode === "view" ? "View Blog" : mode === "edit" ? "Edit Blog" : "Confirm Delete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode === "delete" ? (
          <div>
            <p>Are you sure you want to delete this blog?</p>
            <p><strong>{formData.title}</strong></p>
          </div>
        ) : mode === "view" ? (
          <div>
            <h5>{formData.title}</h5>
            <p><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</p>
            <p><strong>Author:</strong> {formData.author}</p>
            <p>{formData.description}</p>
            <div>
              <h6>Images</h6>
              {formData.images.map((img, index) => (
                <img key={index} src={`http://localhost:3000/${img}`} alt="Blog" style={{ width: "100px", margin: "5px" }} />
              ))}
            </div>
            <div>
              <h6>City Details</h6>
              {formData.cityDetails.map((city, index) => (
                <div key={index}>
                  <p><strong>{city.cityName}</strong></p>
                  <p>{city.description}</p>
                  <a href={city.link} target="_blank" rel="noopener noreferrer">Learn More</a>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Form>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Label>City Details</Form.Label>
            {formData.cityDetails.map((city, index) => (
              <div key={index} className="mb-3">
                <Form.Group>
                  <Form.Label>City Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="cityName"
                    value={city.cityName}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>City Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    rows={3}
                    value={city.description}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Link</Form.Label>
                  <Form.Control
                    type="url"
                    name="link"
                    value={city.link}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </Form.Group>
                <Button variant="danger" onClick={() => handleRemoveCity(index)} className="mt-2">
                  Remove City
                </Button>
              </div>
            ))}
            <Button variant="success" onClick={handleAddCity} className="mt-3">
              Add City
            </Button>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {!mode === "view" && (
          <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        )}
        {mode === "delete" ? (
          <Button variant="danger" onClick={handleDeleteBlog}>
            Confirm Delete
          </Button>
        ) : (<>
         {!mode ==="view" && (
          <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
        )}
        </>
       
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BlogModal;
