import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import ItemForm from "../components/ItemForm";
import NavigateButton from "../components/NavigateButton";
import {
  getItemById,
  Item,
  updateItem,
  deleteItem,
} from "../services/itemService";
import ToastNotification from "../components/ToastNotification";
import ConfirmationModal from "../components/ConfirmationModal";
import {
  getIngredients,
  getIngredientsUsedIn,
  Ingredient,
} from "../services/ingredientService";
import { useAuth } from "../context/AuthContext";

const ItemDetail: React.FC = () => {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const { itemId } = useParams();
  const [item, setItem] = useState<Item>();
  const [itemIngredients, setItemIngredients] = useState<Ingredient[]>([]);
  const [itemIngredientsUsedIn, setItemIngredientsUsedIn] = useState<
    Ingredient[]
  >([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchItem = async () => {
      if (!token) {
        setToastVariant("danger");
        setToastMessage("You must be logged in to view item details.");
        setShowToast(true);
        // logout();
        return;
      }
      try {
        const fetchedItem = await getItemById(Number(itemId), token);
        setItem(fetchedItem);
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message || "An error occurred while fetching the item."
        );
        setShowToast(true);
      }
    };

    const fetchItemIngredients = async () => {
      try {
        if (itemId) {
          const fetchedItemIngredients = await getIngredients(Number(itemId));
          setItemIngredients(fetchedItemIngredients || []);
        }
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message ||
            "An error occurred while fetching the item ingredients."
        );
        setShowToast(true);
      }
    };

    const fetchIngredientsUsedIn = async () => {
      try {
        if (itemId) {
          const fetchedIngredientsUsedIn = await getIngredientsUsedIn(
            Number(itemId)
          );
          setItemIngredientsUsedIn(fetchedIngredientsUsedIn || []);
        }
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message ||
            "An error occurred while fetching ingredients used in."
        );
        setShowToast(true);
      }
    };

    if (itemId) {
      fetchItem();
      fetchItemIngredients();
      fetchIngredientsUsedIn();
    }
  }, [itemId]);

  const handleSubmit = async (data: Item) => {
    try {
      if (!token) {
        setToastVariant("danger");
        setToastMessage("You must be logged in to update an item.");
        setShowToast(true);
        // logout();
        return;
      }

      await updateItem(data.item_id!, data, token);

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

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete !== null) {
      try {
        if (!token) {
          setToastVariant("danger");
          setToastMessage("You must be logged in to delete an item.");
          setShowToast(true);
          // logout();
          return;
        }
        await deleteItem(itemToDelete, token);

        setToastMessage("Item deleted successfully!");
        setToastVariant("success");
        setShowToast(true);

        sessionStorage.setItem("successMessage", "Item deleted successfully!");

        navigate("/search-item");
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(error.message || "Error deleting item.");
        setShowToast(true);
      }
    }

    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  return (
    <div className="container mt-4">
      {/* <NavigateButton
        navUrl="/search-item"
        displayName="<- Back to search items page"
      /> */}
      <h1>Item Detail</h1>

      {item && (
        <ItemForm
          initialData={item}
          onSubmit={handleSubmit}
          onError={handleError}
          onDelete={handleDeleteClick}
          itemIngredients={itemIngredients}
          itemIngredientsUsedIn={itemIngredientsUsedIn}
        />
      )}

      <ConfirmationModal
        show={showConfirmDialog}
        onHide={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        cancelButtonLabel="No, Cancel"
        confirmButtonLabel="Yes, Delete"
        cancelButtonClass="btn btn-secondary"
        confirmButtonClass="btn btn-danger"
      />

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
