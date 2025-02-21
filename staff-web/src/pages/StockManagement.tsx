import React from "react";
import DashboardButton from "../components/DashboardButton";
import tempImg from "../assets/temp_picture.png";

const StockManagement: React.FC = () => {
  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <h2 className="mb-4 text-center">Stock Management</h2>

      <div className="row g-3 w-100 text-center">
        <DashboardButton
          image={tempImg}
          label="Search & Edit Items Button"
          displayName="Search & Edit Items"
          route="/search-item"
        />
        <DashboardButton
          image={tempImg}
          label="Modify Menu Button"
          displayName="Modify Menu"
          route="/modify-menu"
        />
      </div>
    </div>
  );
};

export default StockManagement;
