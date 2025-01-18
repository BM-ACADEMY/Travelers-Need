import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Form } from "react-bootstrap";
import axios from "axios";
import BlogModal from "./model/BlogModel"; // Modal Component

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // To switch between "view", "edit", and "delete" modes

  // Fetch blogs from the backend
  const fetchBlogs = async (page = 1, limit = 10, title = "") => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/blogs/get-all-blogs",
        {
          params: { page, limit, title },
        }
      );
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(page, 10, searchTitle);
  }, [page, searchTitle]);

  // Handle search title filter
  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
    setPage(1); // Reset to page 1 on search change
  };

  // Open modal to view/edit blog
  const handleShowModal = (blog = null, mode = "view") => {
    setCurrentBlog(blog);
    setModalMode(mode);
    setShowModal(true);
  };

  // Handle delete blog
  const handleDeleteBlog = (blogId) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      axios
        .delete(`http://localhost:3000/api/blogs/delete-blog/${blogId}`)
        .then(() => {
          setBlogs(blogs.filter((blog) => blog._id !== blogId));
        });
    }
  };
  const generateImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg";
    const parts = imagePath.split("\\");
    const tourCode = parts[0]?.toLowerCase() || "";
    const fileName = parts[1] || "";
    return `http://localhost:3000/api/tour-plans/get-tour-plan-image?tourCode=${encodeURIComponent(
      tourCode
    )}&fileName=${encodeURIComponent(fileName)}`;
  };

  return (
    <div>
      <div className="mt-3 mb-3">
        <h4 style={{ color: "#ef156c" }}>Blog Details</h4>
      </div>
      <div className="mt-3 mb-3">
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search by title"
            value={searchTitle}
            onChange={handleSearchChange}
          />
        </Form.Group>
      </div>

      {/* Blog Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>
                <img
                  src={generateImageUrl(blog.images[0])}
                  alt={blog.title}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShowModal(blog, "view")}
                >
                  View
                </Button>
                <Button
                  variant="warning"
                  onClick={() => handleShowModal(blog, "edit")}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleShowModal(blog, "delete")}
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
            active={index + 1 === page}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Blog Modal for View/Edit/Delete */}
      <BlogModal
        show={showModal}
        onHide={() => setShowModal(false)}
        blog={currentBlog}
        setBlogs={setBlogs}
        mode={modalMode} // Pass the mode to distinguish between view, edit, and delete
        handleDelete={handleDeleteBlog} // Pass handleDelete function
      />
    </div>
  );
};

export default Blog;
