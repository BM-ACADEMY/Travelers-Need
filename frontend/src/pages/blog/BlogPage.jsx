import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import "./BlogPage.css";
import {fetchBlogByTitle} from "../../modules/admin/services/ApiService";

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

const BlogPage = () => {
  const { title } = useParams(); // Get the blog title from the route
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(false); // Initialize loading state as false
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const GET_IMAGE_FOR_BLOG_URL = import.meta.env.VITE_GET_IMAGE_FOR_BLOG.startsWith(
    "http"
  )
    ? import.meta.env.VITE_GET_IMAGE_FOR_BLOG
    : `${BASE_URL}${import.meta.env.VITE_GET_IMAGE_FOR_BLOG}`;

  const generateImageUrl = (imagePath) => {
    if (!imagePath) return "placeholder.jpg";
    const parts = imagePath.split("\\");
    const title = parts[0]?.toLowerCase() || "";
    const fileName = parts[1] || "";
    return `${GET_IMAGE_FOR_BLOG_URL}?title=${encodeURIComponent(
      title
    )}&fileName=${encodeURIComponent(fileName)}`;
  };
  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true); // Set loading to true before making the API call
      try {
        const response = await fetchBlogByTitle(title)

        if (response.data && response.data.blog) {
          setBlog(response.data.blog); // Update state with the received blog
        } else {
          console.error("Blog not found in response.");
          setBlog(null); // Set blog to null if not found
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
        setBlog(null); // Set blog to null in case of error
      } finally {
        setLoading(false); // Set loading to false after the API call ends
      }
    };

    if (title) {
      fetchBlog();
    }
  }, [title]); // Depend on 'title' change

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>; // Show loading until blog is available
  }

  if (!blog) {
    return <div className="text-center mt-5">Blog not found.</div>; // Show if no blog is found
  }

  return (
    <div className="container mt-4">
      <div className="mt-3 mb-3 text-center">
        <h4 style={{ color: "#ef156c" }}>Blogs </h4>
      </div>
      <hr />
      <h1 className="">{blog.title}</h1>
      <p className="text-muted ">
        <FontAwesomeIcon icon={faCalendarAlt} style={{ color: "#ef156c" }} />{" "}
        {new Date(blog.date).toLocaleDateString()}{" "}
        <span className="mx-2">|</span>
        <FontAwesomeIcon icon={faUser} style={{ color: "#ef156c" }} />{" "}
        {blog.author}
      </p>
      <div className="mb-3">
        <img
          src={generateImageUrl(blog.images[0])}
          alt={blog.title}
          className="img-fluid rounded img-responsive" // Ensures responsive resizing
          style={{
            width: "60vw",
            height: "auto",
            border: "1px solid rgb(217, 215, 215)",
            padding: "5px",
          }} // Makes the image scale responsively
        />
      </div>
      <p>{blog.description}</p>

      <div className="related-cities">
        {blog.cityDetails.map((city, index) => {
          const imageIndex = index + 1;
          return (
            <div
              className="related-city"
              key={city._id}
              style={{ marginBottom: "30px" }}
            >
              <h4 style={{ color: "#ef156c" }}>{city.cityName}</h4>
              <img
                src={generateImageUrl(blog.images[imageIndex])}
                alt={city.cityName}
                className="img-fluid img-responsive" // Ensures responsive resizing
                style={{
                  width: "60vw",
                  height: "auto",
                  border: "1px solid rgb(217, 215, 215)",
                  padding: "5px",
                }} // Makes the image scale responsively
              />
              <p>{city.description}</p>
              <a
                href={city.link}
                className="btn "
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#ef156c", color: "white" }}
              >
                Book Here
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPage;
