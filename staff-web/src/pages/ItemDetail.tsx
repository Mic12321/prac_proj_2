import React, { useState } from "react";
import { useNavigate } from "react-router";
import ItemForm from "../components/ItemForm";
import NavigateButton from "../components/NavigateButton";

const ItemDetail: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    sessionStorage.setItem("successMessage", "Item updated successfully!");
    navigate("/search-item");
  };

  return (
    <div className="container mt-4">
      <NavigateButton
        navUrl="/search-item"
        displayName="<- Back to search items page"
      />
      <h1>Item Detail</h1>

      <ItemForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ItemDetail;
