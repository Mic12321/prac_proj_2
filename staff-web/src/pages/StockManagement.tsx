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
          label="Modify Item Detail Button"
          displayName="Modify Item Detail"
          route="/modify-item-detail"
        />
        <DashboardButton
          image={tempImg}
          label="Modify Menu Button"
          displayName="Modify Menu"
          route="/modify-menu"
        />

        <DashboardButton
          image={tempImg}
          label="Modify Ingredient Detail Button"
          displayName="Modify Ingredient Detail"
          route="/modify-ingredient-detail"
        />
      </div>
    </div>
  );
};

export default StockManagement;
