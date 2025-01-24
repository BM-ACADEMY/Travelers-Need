// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Pagination,
//   Form,
//   Modal,
//   Row,
//   Col,
// } from "react-bootstrap";
// import axios from "axios";
// const generateImageUrl = (imagePath) => {
//   if (!imagePath) return "placeholder.jpg";
//   const parts = imagePath.split("\\");
//   const title = parts[0]?.toLowerCase() || "";
//   const fileName = parts[1] || "";
//   return `http://localhost:3000/api/blogs/get-image?title=${encodeURIComponent(
//     title
//   )}&fileName=${encodeURIComponent(fileName)}`;
// };
// const Blog = () => {
//   const [blogs, setBlogs] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [searchTitle, setSearchTitle] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [currentBlog, setCurrentBlog] = useState(null);
//   const [modalMode, setModalMode] = useState("view"); // Modes: view, add, edit, delete
//   const [cityDetails, setCityDetails] = useState([]);

//   // Fetch blogs from the backend
//   const fetchBlogs = async (page = 1, limit = 10, title = "") => {
//     try {
//       const response = await axios.get(
//         "http://localhost:3000/api/blogs/get-all-blogs",
//         { params: { page, limit, title } }
//       );
//       setBlogs(response.data.blogs);
//       setTotalPages(response.data.pagination.totalPages);
//     } catch (error) {
//       console.error("Error fetching blogs:", error);
//     }
//   };

//   useEffect(() => {
//     fetchBlogs(page, 10, searchTitle);
//   }, [page, searchTitle]);

//   // Handle search filter
//   const handleSearchChange = (e) => {
//     setSearchTitle(e.target.value);
//     setPage(1); // Reset to page 1 on search
//   };

//   // Open modal for view, add, edit, or delete
//   const handleShowModal = (blog = null, mode = "view") => {
//     setCurrentBlog(blog);
//     setModalMode(mode);
//     setShowModal(true);
//     setCityDetails(blog?.cityDetails || []); // Initialize cityDetails in case of edit
//   };

//   // Handle blog form submission
//   const handleBlogSubmit = async (blogData) => {
//     try {
//       if (modalMode === "add") {
//         const response = await axios.post(
//           "http://localhost:3000/api/blogs/create-blog",
//           blogData
//         );
//         if (response.data) {
//           fetchBlogs();
//         }
//         setBlogs([response.data.blog, ...blogs]);
//       } else if (modalMode === "edit" && currentBlog) {
//         const response = await axios.patch(
//           `http://localhost:3000/api/blogs/update-blog/${currentBlog._id}`,
//           blogData
//         );
//         if (response.data) {
//           fetchBlogs();
//         }
//         setBlogs(
//           blogs.map((blog) =>
//             blog._id === currentBlog._id ? response.data.blog : blog
//           )
//         );
//       }
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error submitting blog:", error);
//     }
//   };

//   // Handle delete
//   const handleDeleteBlog = async () => {
//     try {
//       await axios.delete(
//         `http://localhost:3000/api/blogs/delete-blog/${currentBlog._id}`
//       );
//       if (response.data) {
//         fetchBlogs();
//       }
//       setBlogs(blogs.filter((blog) => blog._id !== currentBlog._id));
//       setShowModal(false);
//     } catch (error) {
//       console.error("Error deleting blog:", error);
//     }
//   };

//   // Add a new city detail object
//   const handleAddCityDetail = () => {
//     setCityDetails([
//       ...cityDetails,
//       { cityName: "", description: "", link: "" },
//     ]);
//   };

//   const handleRemoveCityDetail = (index) => {
//     setCityDetails(cityDetails.filter((_, i) => i !== index));
//   };

//   const handleCityDetailChange = (index, field, value) => {
//     const updatedCityDetails = [...cityDetails];
//     updatedCityDetails[index][field] = value;
//     setCityDetails(updatedCityDetails);
//   };

//   return (
//     <div>
//       <div className="mt-3 mb-3 d-flex justify-content-between align-items-center">
//         <h4 style={{ color: "#ef156c" }}>Blog Details</h4>
//         <Button variant="success" onClick={() => handleShowModal(null, "add")}>
//          + Add Blog
//         </Button>
//       </div>

//       <div className="mt-3 mb-3">
//         <Form.Group>
//           <Form.Control
//             type="text"
//             placeholder="Search by title"
//             value={searchTitle}
//             onChange={handleSearchChange}
//           />
//         </Form.Group>
//       </div>

//       {/* Blog Table */}
//       <Table striped bordered hover responsive>
//         <thead>
//           <tr>
//             <th>Image</th>
//             <th>Title</th>
//             <th>Author</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {blogs.map((blog) => (
//             <tr key={blog._id}>
//               <td>
//                 <img
//                   src={generateImageUrl(blog.images?.[0]) || "placeholder.jpg"}
//                   alt={blog.title}
//                   style={{ width: "100px", height: "auto" }}
//                 />
//               </td>
//               <td>{blog.title}</td>
//               <td>{blog.author}</td>
//               <td>
//                 <Button
//                   variant="info"
//                   onClick={() => handleShowModal(blog, "view")}
//                 >
//                   View
//                 </Button>
//                 <Button
//                   variant="warning"
//                   onClick={() => handleShowModal(blog, "edit")}
//                 >
//                   Edit
//                 </Button>
//                 <Button
//                   variant="danger"
//                   onClick={() => handleShowModal(blog, "delete")}
//                 >
//                   Delete
//                 </Button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </Table>

//       {/* Pagination */}
//       <Pagination>
//         {[...Array(totalPages)].map((_, index) => (
//           <Pagination.Item
//             key={index + 1}
//             active={index + 1 === page}
//             onClick={() => setPage(index + 1)}
//           >
//             {index + 1}
//           </Pagination.Item>
//         ))}
//       </Pagination>

//       {/* Modal */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {modalMode === "add"
//               ? "Add Blog"
//               : modalMode === "edit"
//               ? "Edit Blog"
//               : modalMode === "delete"
//               ? "Delete Blog"
//               : "View Blog"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body
//           style={{
//             height: modalMode === "delete" ? "auto" : "60vh",
//             overflowY: modalMode === "delete" ? "visible" : "scroll",
//           }}
//         >
//           {modalMode === "view" && currentBlog && (
//             <>
//               <div className="text-center mb-3">
//                 <img
//                   src={
//                     generateImageUrl(currentBlog.images?.[0]) ||
//                     "placeholder.jpg"
//                   }
//                   alt={currentBlog.title}
//                   style={{ maxWidth: "100%", borderRadius: "8px" }}
//                 />
//               </div>
//               <h4>{currentBlog.title}</h4>
//               <p>
//                 <strong>Author: </strong>
//                 {currentBlog.author}
//               </p>
//               <p>{currentBlog.description}</p>

//               {/* City Details Loop */}
//               {currentBlog.cityDetails.map((city, index) => {
//                 const imageIndex = index + 1; // Start from index 1 for the city images
//                 return (
//                   <div key={city._id}>
//                     <h4>{city.cityName}</h4>
//                     <img
//                       src={
//                         generateImageUrl(currentBlog.images[imageIndex]) ||
//                         "placeholder.jpg"
//                       }
//                       alt={city.cityName}
//                       style={{ maxWidth: "100%", borderRadius: "8px" }}
//                     />
//                     <p>{city.description}</p>
//                     <a
//                       href={city.link}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       More Details
//                     </a>
//                   </div>
//                 );
//               })}
//             </>
//           )}
//           {["add", "edit"].includes(modalMode) && (
//             <Form
//               onSubmit={(e) => {
//                 e.preventDefault();
//                 const formData = new FormData(e.target);
//                 const blogData = Object.fromEntries(formData.entries());
//                 blogData.cityDetails = cityDetails; // Include cityDetails
//                 handleBlogSubmit(blogData);
//               }}
//             >
//               <Form.Group className="mb-3">
//                 <Form.Label>Title</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="title"
//                   defaultValue={modalMode === "edit" ? currentBlog?.title : ""}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Author</Form.Label>
//                 <Form.Control
//                   type="text"
//                   name="author"
//                   defaultValue={modalMode === "edit" ? currentBlog?.author : ""}
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Description</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   name="description"
//                   rows={3}
//                   defaultValue={
//                     modalMode === "edit" ? currentBlog?.description : ""
//                   }
//                   required
//                 />
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Images</Form.Label>
//                 <Form.Control
//                   as="textarea"
//                   name="description"
//                   rows={3}
//                   defaultValue={
//                     modalMode === "edit" ? currentBlog?.description : ""
//                   }
//                   required
//                 />
//               </Form.Group>

//               {/* City Details */}
//               <h5>City Details</h5>
//               {cityDetails.map((city, index) => (
//                 <Row key={index} className="mb-3">
//                   <Col>
//                     <Form.Control
//                       type="text"
//                       placeholder="City Name"
//                       value={city.cityName}
//                       onChange={(e) =>
//                         handleCityDetailChange(
//                           index,
//                           "cityName",
//                           e.target.value
//                         )
//                       }
//                       required
//                     />
//                   </Col>
//                   <Col>
//                     <Form.Control
//                       type="text"
//                       placeholder="Description"
//                       value={city.description}
//                       onChange={(e) =>
//                         handleCityDetailChange(
//                           index,
//                           "description",
//                           e.target.value
//                         )
//                       }
//                       required
//                     />
//                   </Col>
//                   <Col>
//                     <Form.Control
//                       type="url"
//                       placeholder="Link"
//                       value={city.link}
//                       onChange={(e) =>
//                         handleCityDetailChange(index, "link", e.target.value)
//                       }
//                       required
//                     />
//                   </Col>
//                   <Col xs="auto">
//                     <Button
//                       variant="danger"
//                       onClick={() => handleRemoveCityDetail(index)}
//                     >
//                       Remove
//                     </Button>
//                   </Col>
//                 </Row>
//               ))}
//               <Button variant="success" onClick={handleAddCityDetail}>
//                 Add City
//               </Button>

//               <div className="mt-4">
//                 <Button variant="primary" type="submit">
//                   {modalMode === "add" ? "Add Blog" : "Save Changes"}
//                 </Button>
//               </div>
//             </Form>
//           )}
//           {modalMode === "delete" && (
//             <p>Are you sure you want to delete this blog?</p>
//           )}
//         </Modal.Body>

//         <Modal.Footer>
//           {modalMode === "delete" ? (
//             <Button variant="danger" onClick={handleDeleteBlog}>
//               Delete
//             </Button>
//           ) : null}
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default Blog;


import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Form,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import {deleteBlog,updateBlog,createBlog,fetchAllBlogs} from "../../services/ApiService";


const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTitle, setSearchTitle] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [modalMode, setModalMode] = useState("view"); // Modes: view, add, edit, delete
  const [cityDetails, setCityDetails] = useState([]);
  const [formImages, setFormImages] = useState([]);
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
  // Fetch blogs from the backend
  const fetchBlogs = async (page = 1, limit = 10, title = "") => {
    try {
      const response = await fetchAllBlogs(page,limit,title);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  useEffect(() => {
    fetchBlogs(page, 10, searchTitle);
  }, [page, searchTitle]);

  // Handle search filter
  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
    setPage(1); // Reset to page 1 on search
  };

  // Open modal for view, add, edit, or delete
  const handleShowModal = (blog = null, mode = "view") => {
    setCurrentBlog(blog);
    setModalMode(mode);
    setShowModal(true);
    setCityDetails(blog?.cityDetails || []); // Initialize cityDetails in case of edit
    setFormImages(blog?.images || []); // Initialize images in case of edit
  };

  // Handle form data change for image
  const handleImageChange = (e) => {
    const files = e.target.files;
    setFormImages(files);
  };

  // Handle blog form submission
  // const handleBlogSubmit = async (blogData) => {
  //   console.log(blogData);
    
  //   try {
  //     const formData = new FormData();

  //     // Add form fields
  //     formData.append("title", blogData.title);
  //     formData.append("author", blogData.author);
  //     formData.append("description", blogData.description);

  //     // Add cityDetails
  //     if (blogData.cityDetails) {
  //       formData.append("cityDetails", JSON.stringify(blogData.cityDetails));
  //     }
  //     // Append images to FormData
  //     if (formImages.length > 0) {
  //       for (let i = 0; i < formImages.length; i++) {
  //         formData.append("images", formImages[i]);
  //       }
  //     }

  //     if (modalMode === "add") {
  //       const response = await axios.post(
  //         "http://localhost:3000/api/blogs/create-blog",
  //         formData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       if (response.data) {
  //         fetchBlogs();
  //       }
  //       setBlogs([response.data.blog, ...blogs]);
  //     } else if (modalMode === "edit" && currentBlog) {
  //       console.log(currentBlog);
        
  //       const response = await axios.put(
  //         `http://localhost:3000/api/blogs/update-blog/${currentBlog._id}`,
  //         formData,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       if (response.data) {
  //         fetchBlogs();
  //       }
  //       setBlogs(
  //         blogs.map((blog) =>
  //           blog._id === currentBlog._id ? response.data.blog : blog
  //         )
  //       );
  //     }
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error submitting blog:", error);
  //   }
  // };
  // const handleBlogSubmit = async (blogData) => {
  //   console.log(blogData);
  
  //   try {
  //     const formData = new FormData();
  
  //     // Add form fields
  //     formData.append("title", blogData.title);
  //     formData.append("author", blogData.author);
  //     formData.append("description", blogData.description);
  
  //     // Handle cityDetails: stringify the array of objects
  //     if (blogData.cityDetails && Array.isArray(blogData.cityDetails)) {
  //       formData.append("cityDetails", JSON.stringify(blogData.cityDetails));
  //     }
  
  //     // Handle images: append new images if provided
  //     if (formImages.length > 0) {
  //       for (let i = 0; i < formImages.length; i++) {
  //         formData.append("images", formImages[i]);
  //       }
  //     } else if (modalMode === "edit" && currentBlog && currentBlog.images) {
  //       // If no new images, send existing images from the blog
  //       currentBlog.images.forEach(image => {
  //         formData.append("images", image);  // Send existing images
  //       });
  //     }
  
  //     const requestUrl = modalMode === "add"
  //       ? "http://localhost:3000/api/blogs/create-blog"
  //       : `http://localhost:3000/api/blogs/update-blog/${currentBlog._id}`;
  
  //     const requestMethod = modalMode === "add" ? "post" : "put";
  
  //     const response = await axios({
  //       method: requestMethod,
  //       url: requestUrl,
  //       data: formData,
  //       headers: { "Content-Type": "multipart/form-data" }
  //     });
  
  //     if (response.data) {
  //       fetchBlogs();
  //       setBlogs(
  //         modalMode === "add"
  //           ? [response.data.blog, ...blogs]
  //           : blogs.map((blog) => blog._id === currentBlog._id ? response.data.blog : blog)
  //       );
  //     }
  //     setShowModal(false);
  //   } catch (error) {
  //     console.error("Error submitting blog:", error);
  //   }
  // };
  const handleBlogSubmit = async (blogData) => {
    console.log(blogData);
  
    try {
      const formData = new FormData();
  
      // Add form fields
      formData.append("title", blogData.title);
      formData.append("author", blogData.author);
      formData.append("description", blogData.description);
  
      // Handle cityDetails: stringify the array of objects
      if (blogData.cityDetails && Array.isArray(blogData.cityDetails)) {
        formData.append("cityDetails", JSON.stringify(blogData.cityDetails));
      }
  
      // Handle images: append new images if provided
      if (formImages.length > 0) {
        for (let i = 0; i < formImages.length; i++) {
          formData.append("images", formImages[i]);
        }
      } else if (modalMode === "edit" && currentBlog && currentBlog.images) {
        // If no new images, send existing images from the blog
        currentBlog.images.forEach(image => {
          formData.append("images", image);  // Send existing images
        });
      }
  
      // Determine the request method and URL based on modal mode
      if (modalMode === "add") {
        // Call the createBlog function for adding a new blog
        const response = await createBlog(formData);
        
        if (response.data) {
          fetchBlogs();
          setBlogs([response.data.blog, ...blogs]);
        }
      } else if (modalMode === "edit" && currentBlog) {
        // Call the updateBlog function for updating an existing blog
        const response = await updateBlog(currentBlog._id, formData);
        
        if (response.data) {
          fetchBlogs();
          setBlogs(blogs.map((blog) => 
            blog._id === currentBlog._id ? response.data.blog : blog
          ));
        }
      }
  
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting blog:", error);
    }
  };
  
  // Handle delete
  const handleDeleteBlog = async () => {
    try {
      await deleteBlog(currentBlog._id);
      fetchBlogs();
      setBlogs(blogs.filter((blog) => blog._id !== currentBlog._id));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Add a new city detail object
  const handleAddCityDetail = () => {
    setCityDetails([
      ...cityDetails,
      { cityName: "", description: "", link: "" },
    ]);
  };

  const handleRemoveCityDetail = (index) => {
    setCityDetails(cityDetails.filter((_, i) => i !== index));
  };

  const handleCityDetailChange = (index, field, value) => {
    const updatedCityDetails = [...cityDetails];
    updatedCityDetails[index][field] = value;
    setCityDetails(updatedCityDetails);
  };

  return (
    <div>
      <div className="mt-3 mb-3 d-flex justify-content-between align-items-center">
        <h4 style={{ color: "#ef156c" }}>Blog Details</h4>
        <Button variant="success" onClick={() => handleShowModal(null, "add")}>
          + Add Blog
        </Button>
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
                  src={generateImageUrl(blog.images?.[0]) || "placeholder.jpg"}
                  alt={blog.title}
                  style={{ width: "100px", height: "auto" }}
                />
              </td>
              <td>{blog.title}</td>
              <td>{blog.author}</td>
              <td>
               <div className="d-flex gap-2">
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
            active={index + 1 === page}
            onClick={() => setPage(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === "add"
              ? "Add Blog"
              : modalMode === "edit"
              ? "Edit Blog"
              : modalMode === "delete"
              ? "Delete Blog"
              : "View Blog"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            height: modalMode === "delete" ? "auto" : "60vh",
            overflowY: modalMode === "delete" ? "visible" : "scroll",
          }}
        >
          {modalMode === "view" && currentBlog && (
            <>
              <div className="text-center mb-3">
                <img
                  src={
                    generateImageUrl(currentBlog.images?.[0]) ||
                    "placeholder.jpg"
                  }
                  alt={currentBlog.title}
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
              <h4>{currentBlog.title}</h4>
              <p>
                <strong>Author: </strong>
                {currentBlog.author}
              </p>
              <p>{currentBlog.description}</p>

              {/* City Details Loop */}
              {currentBlog.cityDetails.map((city, index) => {
                const imageIndex = index + 1; // Start from index 1 for the city images
                return (
                  <div key={city._id}>
                    <h4>{city.cityName}</h4>
                    <img
                      src={
                        generateImageUrl(currentBlog.images[imageIndex]) ||
                        "placeholder.jpg"
                      }
                      alt={city.cityName}
                      style={{ maxWidth: "100%", borderRadius: "8px" }}
                    />
                    <p>{city.description}</p>
                    <a
                      href={city.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      More Details
                    </a>
                  </div>
                );
              })}
            </>
          )}
          {["add", "edit"].includes(modalMode) && (
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const blogData = Object.fromEntries(formData.entries());
                blogData.cityDetails = cityDetails; // Include cityDetails
                handleBlogSubmit(blogData);
              }}
            >
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  defaultValue={modalMode === "edit" ? currentBlog?.title : ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Author</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  defaultValue={modalMode === "edit" ? currentBlog?.author : ""}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  rows={3}
                  defaultValue={
                    modalMode === "edit" ? currentBlog?.description : ""
                  }
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Images</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  onChange={handleImageChange}
                />
              </Form.Group>

              {/* City Details */}
              <h5>City Details</h5>
              {cityDetails.map((city, index) => (
                <Row key={index} className="mb-3">
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="City Name"
                      value={city.cityName}
                      onChange={(e) =>
                        handleCityDetailChange(
                          index,
                          "cityName",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      value={city.description}
                      onChange={(e) =>
                        handleCityDetailChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="url"
                      placeholder="Link"
                      value={city.link}
                      onChange={(e) =>
                        handleCityDetailChange(index, "link", e.target.value)
                      }
                      required
                    />
                  </Col>
                  <Col xs="auto">
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveCityDetail(index)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button variant="success" onClick={handleAddCityDetail}>
                Add City
              </Button>

              <div className="mt-4">
                <Button variant="primary" type="submit">
                  {modalMode === "add" ? "Add Blog" : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
          {modalMode === "delete" && (
            <p>Are you sure you want to delete this blog?</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          {modalMode === "delete" ? (
            <Button variant="danger" onClick={handleDeleteBlog}>
              Delete
            </Button>
          ) : null}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Blog;

