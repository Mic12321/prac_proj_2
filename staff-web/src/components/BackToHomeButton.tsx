import React from "react";
import { useNavigate } from "react-router";

const BackToHomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-auto mb-3 d-flex justify-content-center">
      <button className="btn btn-primary" onClick={() => navigate("/home")}>
        Back to Home
      </button>
    </div>
  );
};

export default BackToHomeButton;
