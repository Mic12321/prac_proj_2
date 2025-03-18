import React, { useState } from "react";
import { useNavigate } from "react-router";
import ItemForm from "../components/ItemForm";
import NavigateButton from "../components/NavigateButton";
import { addItem } from "../services/itemService";
import ToastNotification from "../components/ToastNotification";

const AddItem: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const handleSubmit = async (data: any) => {
    try {
      await addItem(data);

      setToastMessage("Item added successfully!");
      setToastVariant("success");
      setShowToast(true);

      sessionStorage.setItem("successMessage", "Item added successfully!");
      navigate("/search-item");
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(
        error.message || "An error occurred while adding the item."
      );
      setShowToast(true);
    }
  };

  const handleError = (message: string) => {
    setToastVariant("danger");
    setToastMessage(message);
    setShowToast(true);
  };

  return (
    <div className="container mt-4">
      <NavigateButton
        navUrl="/search-item"
        displayName="<- Back to search items page"
      />
      <h1>Add New Item</h1>

      <ItemForm onSubmit={handleSubmit} onError={handleError} />
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant={toastVariant}
        delay={5000}
      />
    </div>
  );
};

export default AddItem;
