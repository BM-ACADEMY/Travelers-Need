import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const BlogModal = ({ show, onHide, blog, setBlogs, mode, handleDelete }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    cityDetails: [{ cityName: "", cityDescription: "", cityImage: "" }],
  });

  const [imageFile, setImageFile] = useState(null);

  // Populate form data or reset form based on `blog` and `mode`
  useEffect(() => {
    if (blog && mode !== "delete") {
      setFormData({
        title: blog.title,
        author: blog.author,
        description: blog.description,
        image: blog.image || "",
        cityDetails: blog.cityDetails || [{ cityName: "", cityDescription: "", cityImage: "" }],
      });
    } else {
      resetForm();
    }
  }, [blog, mode]);

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      image: "",
      cityDetails: [{ cityName: "", cityDescription: "", cityImage: "" }],
    });
    setImageFile(null);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setFormData((prev) => ({ ...prev, image: file ? file.name : "" }));
  };

  const handleAddCity = () => {
    setFormData((prev) => ({
      ...prev,
      cityDetails: [...prev.cityDetails, { cityName: "", cityDescription: "", cityImage: "" }],
    }));
  };

  const handleRemoveCity = (index) => {
    const updatedCityDetails = formData.cityDetails.filter((_, i) => i !== index);
    setFormData({ ...formData, cityDetails: updatedCityDetails });
  };

  const handleSubmit = () => {
    const { title, author, description, cityDetails } = formData;
    const data = { title, author, description, cityDetails };

    if (imageFile) {
      const uploadData = new FormData();
      uploadData.append("image", imageFile);

      axios
        .post("http://localhost:5000/api/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          data.image = response.data.imageUrl;
          submitBlogData(data);
        })
        .catch((error) => console.error("Error uploading image:", error));
    } else {
      submitBlogData(data);
    }
  };

  const submitBlogData = (data) => {
    if (mode === "edit") {
      axios.patch(`http://localhost:3000/api/blogs/update-blog/${blog._id}`, data).then((response) => {
        setBlogs((prev) => prev.map((b) => (b._id === blog._id ? response.data : b)));
        onHide();
      });
    } else {
      axios.post("http://localhost:3000/api/blogs/create-blog", data).then((response) => {
        setBlogs((prev) => [...prev, response.data]);
        onHide();
      });
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
          {mode === "edit" ? "Edit Blog" : mode === "view" ? "View Blog" : "Confirm Delete"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mode === "delete" ? (
          <div>
            <p>Are you sure you want to delete this blog?</p>
            <p><strong>{formData.title}</strong></p>
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
                disabled={mode === "view"}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                disabled={mode === "view"}
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
                disabled={mode === "view"}
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
                    disabled={mode === "view"}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>City Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="cityDescription"
                    rows={3}
                    value={city.cityDescription}
                    onChange={(e) => handleInputChange(e, index)}
                    disabled={mode === "view"}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>City Image</Form.Label>
                  <Form.Control
                    type="text"
                    name="cityImage"
                    value={city.cityImage}
                    onChange={(e) => handleInputChange(e, index)}
                    disabled={mode === "view"}
                  />
                </Form.Group>
                {mode === "edit" && (
                  <Button variant="danger" onClick={() => handleRemoveCity(index)} className="mt-2">
                    Remove City
                  </Button>
                )}
              </div>
            ))}
            {mode === "edit" && (
              <>
                <Button variant="success" onClick={handleAddCity} className="mt-3">
                  Add City
                </Button>
                <Form.Group className="mt-3">
                  <Form.Label>Upload New Image (Optional)</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
              </>
            )}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {mode === "delete" ? (
          <Button variant="danger" onClick={handleDeleteBlog}>
            Confirm Delete
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} disabled={mode === "view"}>
            Save Changes
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default BlogModal;
