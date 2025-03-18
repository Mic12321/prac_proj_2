import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ItemForm from "../components/ItemForm";
import NavigateButton from "../components/NavigateButton";
import { getItemById, Item, updateItem } from "../services/itemService";
import ToastNotification from "../components/ToastNotification";

const ItemDetail: React.FC = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [item, setItem] = useState<Item>();

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const fetchedItem = await getItemById(Number(itemId));
        setItem(fetchedItem);
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message || "An error occurred while fetching the item."
        );
        setShowToast(true);
      }
    };

    if (itemId) {
      fetchItem();
    }
  }, [itemId]);

  const handleSubmit = async (data: Item) => {
    try {
      await updateItem(data.item_id!, data);

      setToastMessage("Item updated successfully!");
      setToastVariant("success");
      setShowToast(true);

      sessionStorage.setItem("successMessage", "Item updated successfully!");
      navigate("/search-item");
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(
        error.message || "An error occurred while updating the item."
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
      <h1>Item Detail</h1>

      {item && (
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          onError={handleError}
        />
      )}
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

export default ItemDetail;
