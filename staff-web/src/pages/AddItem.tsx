import React, { useState } from "react";
import { useNavigate } from "react-router";
import ItemForm from "../components/ItemForm";
import NavigateButton from "../components/NavigateButton";

const AddItem: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (data: any) => {
    sessionStorage.setItem("successMessage", "Item added successfully!");
    navigate("/search-item");
  };

  return (
    <div className="container mt-4">
      <NavigateButton
        navUrl="/search-item"
        displayName="<- Back to search items page"
      />
      <h1>Add New Item</h1>

      <ItemForm onSubmit={handleSubmit} />
    </div>
  );
};

export default AddItem;
