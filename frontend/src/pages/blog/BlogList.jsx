import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import './BlogList.css'; // Optional for styling
import {fetchAllBlogs} from "../../modules/admin/services/ApiService";
// Helper function to generate image URL
// const generateImageUrl = (imagePath) => {
//   if (!imagePath) return "placeholder.jpg";
//   const parts = imagePath.split("\\");
//   const title = parts[0]?.toLowerCase() || "";
//   const fileName = parts[1] || "";
//   return `http://localhost:3000/api/blogs/get-image?title=${encodeURIComponent(
//     title
//   )}&fileName=${encodeURIComponent(fileName)}`;
// };

// Format the blog title for use in the URL
const formatTitle = (title) => {
  return title.toLowerCase().replace(/\s+/g, '_');
};

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const GET_IMAGE_FOR_BLOG_URL = import.meta.env.VITE_GET_IMAGE_FOR_BLOG.startsWith("http")
  ? import.meta.env.VITE_GET_IMAGE_FOR_BLOG
  : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_BLOG}`;

const generateImageUrl = (imagePath) => {
  if (!imagePath) return "placeholder.jpg";
  const parts = imagePath.split("\\");
  const title = parts[0]?.toLowerCase() || "";
  const fileName = parts[1] || "";
  return `${GET_IMAGE_FOR_BLOG_URL}?title=${encodeURIComponent(title)}&fileName=${encodeURIComponent(fileName)}`;
};
  useEffect(  () => {
    // Fetch blogs from API
     fetchAllBlogs() 
      .then((response) => setBlogs(response.data.blogs))
      .catch((error) => console.error('Error fetching blogs:', error));
  }, []);

  return (
    <div className="container mt-4">
  <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Latest Blogs </h4>
      </div>
      <div className="row d-flex flex-column flex-md-row">
        {blogs.map((blog) => (
          <div className="col-md-6 col-lg-4 mb-4" key={blog._id}>
            <div className="card">
              <img
                src={generateImageUrl(blog.images[0])} // Use the first image
                className="card-img-top"
                alt={blog.title}
              />
              <div className="card-body">
                <h5 className="card-title">{blog.title}</h5>
                <p className="card-text text-muted">
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#ef156c" }} />{' '}
                  {new Date(blog.date).toLocaleDateString()}{' '}
                  <span className="mx-2">|</span>
                  <FontAwesomeIcon icon={faUser} style={{ color: "#ef156c" }} /> {blog.author}
                </p>
                <p className="card-text">{blog.description.slice(0, 100)}...</p>
                <Link to={`/blog/${formatTitle(blog.title)}`} className="btn" style={{ backgroundColor: "#ef156c", color: "white" }}>
                  Continue Reading
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
