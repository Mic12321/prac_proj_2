import React from "react";
import { useNavigate } from "react-router";

interface DashboardButtonProps {
  image: string;
  label: string;
  displayName: string;
  route: string;
}

const DashboardButton: React.FC<DashboardButtonProps> = ({
  image,
  label,
  displayName,
  route,
}) => {
  const navigate = useNavigate();

  return (
    <div className="col-6 col-md-3">
      <button
        className="btn btn-light w-100 shadow p-3"
        onClick={() => navigate(route)}
      >
        <img src={image} alt={label} className="img-fluid rounded" />
        <p className="mt-2 fw-bold">{displayName}</p>
      </button>
    </div>
  );
};

export default DashboardButton;
