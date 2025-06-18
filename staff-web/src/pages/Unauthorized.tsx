import React from "react";
import { useNavigate } from "react-router";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h1 className="text-danger mb-4">403 - Unauthorized</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <button className="btn btn-primary" onClick={() => navigate(-1)}>
        Go Back
      </button>
    </div>
  );
};

export default Unauthorized;
