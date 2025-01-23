

import React from "react";
import { Link } from "react-router-dom";
const NotFound = () => {
    return (
      <div className="container text-center vh-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-1">404</h1>
        <p className="lead">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Go Back Home
        </Link>
      </div>
    );
  };
  export default NotFound;