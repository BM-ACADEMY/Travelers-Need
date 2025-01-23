import React from "react";
import { Link } from "react-router-dom";

const Not_Found = () => {
  return (
    <div className="container text-center vh-100 d-flex flex-column justify-content-center align-items-center">
      <h1 className="display-1">404</h1>
      <p className="lead">The page you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to Home
      </Link>
    </div>
  );
};

export default Not_Found;
