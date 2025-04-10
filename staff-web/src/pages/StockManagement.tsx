import React from "react";
import DashboardButton from "../components/DashboardButton";
import tempImg from "../assets/temp_picture.png";
import NavigateButton from "../components/NavigateButton";

const StockManagement: React.FC = () => {
  return (
    <div>
      <div className="container mt-4">
        <NavigateButton
          navUrl="/home"
          displayName="<- Back to dashboard page"
        />
      </div>
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
            label="Category Management Button"
            displayName="Category Management"
            route="/stock-management"
          />
          <DashboardButton
            image={tempImg}
            label="Create Stock Order Button"
            displayName="Stock Order Management"
            route="/stock-management"
          />
        </div>
      </div>
    </div>
  );
};

export default StockManagement;
