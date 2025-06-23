import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategoryById,
  Category,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import {
  deleteItem,
  getItemsByCategoryId,
  Item,
  updateItem,
} from "../services/itemService";
import ItemTable from "../components/ItemTable";
import ToastNotification from "../components/ToastNotification";
import ConfirmationModal from "../components/ConfirmationModal";
import CategoryForm from "../components/CategoryForm";
import { applySort } from "../utils/sorting";
import { useAuth } from "../context/AuthContext";

const CategoryDetail: React.FC = () => {
  const { token, logout } = useAuth();

  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [sortedItems, setSortedItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [originalItem, setOriginalItem] = useState<Item | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: "asc" | "desc";
  } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [mode, setMode] = useState<"edit" | "display">("edit");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationModalTitle, setConfirmationModalTitle] =
    useState<string>("");
  const [confirmationModalMessage, setConfirmationModalMessage] =
    useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId) {
        setLoading(true);
        try {
          if (!token) {
            setToastVariant("danger");
            setToastMessage("You must be logged in to view category details.");
            setShowToast(true);
            // logout();
            return;
          }
          const fetchedCategory = await getCategoryById(Number(categoryId));
          const fetchedItems = await getItemsByCategoryId(
            Number(categoryId),
            token
          );

          if (fetchedCategory && fetchedItems) {
            const itemsWithCategoryName = fetchedItems.map((item) => ({
              ...item,
              category_name: fetchedCategory.category_name,
            }));

            setCategory(fetchedCategory);
            setItems(itemsWithCategoryName);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [categoryId]);

  useEffect(() => {
    if (sortConfig && sortConfig.key) {
      setSortedItems(
        applySort(
          [...items],
          sortConfig.key,
          sortConfig.direction as "asc" | "desc"
        )
      );
    } else {
      setSortedItems(items);
    }
  }, [items, sortConfig]);

  const handleEditItem = (item: Item) => {
    if (editedItem && editedItem.item_id !== item.item_id) {
      if (
        originalItem &&
        JSON.stringify(editedItem) !== JSON.stringify(originalItem)
      ) {
        const userConfirmed = window.confirm(
          "You have unsaved changes. Do you want to discard them?"
        );
        if (!userConfirmed) return;
      }
    }

    setOriginalItem({ ...item });
    setEditedItem(item);
  };

  const handleSaveItem = async () => {
    if (!editedItem) return;

    if (JSON.stringify(editedItem) === JSON.stringify(originalItem)) {
      setToastVariant("info");
      setToastMessage("No changes were made to the item.");
      setShowToast(true);
      return;
    }

    try {
      if (!token) {
        setToastVariant("danger");
        setToastMessage("You must be logged in to update an item.");
        setShowToast(true);
        // logout();
        return;
      }

      const updatedItem = await updateItem(
        editedItem.item_id!,
        editedItem,
        token
      );

      if (updatedItem) {
        const updatedItems = items.map((item) =>
          item.item_id === editedItem.item_id
            ? { ...item, ...editedItem }
            : item
        );

        setItems(updatedItems);
        setEditedItem(null);
        setToastVariant("success");
        setToastMessage("Item updated successfully!");
        setShowToast(true);
      }
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Failed to update item.");
      setShowToast(true);
    }
  };

  const handleCancelEdit = () => {
    if (originalItem) {
      setItems((prev) =>
        prev.map((item) =>
          item.item_id === originalItem.item_id ? originalItem : item
        )
      );
    }
    setEditedItem(null);
    setOriginalItem(null);
  };

  const handleSort = (key: keyof Item) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleRemoveItem = (item: Item) => {
    setItemToDelete(item.item_id!);
    setConfirmationModalTitle("Delete Item");
    setConfirmationModalMessage("Are you sure you want to delete this item?");
    setConfirmAction(() => () => handleDeleteConfirmItem(item.item_id!));
    setShowConfirmDialog(true);
  };

  const navigateToDetail = (id: number) => {
    navigate(`/item-detail/${id}`);
  };

  const handleSubmit = async (data: Category) => {
    try {
      const updateSuccess = await updateCategory(data.category_id!, data);

      if (updateSuccess) {
        setToastVariant("success");
        setToastMessage("Category updated successfully!");
        setShowToast(true);
      }
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Error updating category.");
      setShowToast(true);
    }
  };

  const handleDeleteCategory = () => {
    if (items.length > 0) {
      setToastVariant("danger");
      setToastMessage("Cannot delete category with linked items.");
      setShowToast(true);
      return;
    }

    setConfirmationModalTitle("Delete Category");
    setConfirmationModalMessage(
      "Are you sure you want to delete this category?"
    );
    setConfirmAction(() => handleDeleteConfirmCategory);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirmItem = async (id: number) => {
    if (!token) {
      setToastVariant("danger");
      setToastMessage("You must be logged in to delete an item.");
      setShowToast(true);
      // logout();
      return;
    }

    try {
      const deleteSuccess = await deleteItem(id, token);

      if (deleteSuccess) {
        setItems((prev) => prev.filter((item) => item.item_id !== id));
        setToastVariant("success");
        setToastMessage("Item deleted successfully!");
        setShowToast(true);
      }
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Error deleting item.");
      setShowToast(true);
    }
    setShowConfirmDialog(false);
    setItemToDelete(null);
  };

  const handleDeleteConfirmCategory = async () => {
    try {
      const deleteSuccess = await deleteCategory(category!.category_id!);

      if (deleteSuccess) {
        sessionStorage.setItem(
          "successMessage",
          "Category deleted successfully!"
        );
        navigate("/category-management");
      }
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Error deleting category.");
      setShowToast(true);
    }
    setShowConfirmDialog(false);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
        <p>Loading category details...</p>
      </div>
    );
  }

  if (!category) {
    return <p>Category not found.</p>;
  }

  return (
    <div className="container mt-4">
      <h2>Category Detail</h2>

      <CategoryForm
        initialCategory={category}
        onSubmit={handleSubmit}
        onDelete={handleDeleteCategory}
        hasItems={items.length !== 0}
      />

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h4>Items ({items.length})</h4>
      </div>

      <ItemTable
        items={sortedItems}
        editedItem={editedItem}
        sortConfig={sortConfig}
        onEditItem={handleEditItem}
        onSaveItem={handleSaveItem}
        onCancelEdit={handleCancelEdit}
        onSort={handleSort}
        setEditedItem={setEditedItem}
        navigateToDetail={navigateToDetail}
        mode={mode}
        onSelectItem={() => {}}
        showRemoveButton={true}
        onRemoveItem={handleRemoveItem}
      />

      <ConfirmationModal
        show={showConfirmDialog}
        onHide={handleDeleteCancel}
        onConfirm={confirmAction ?? (() => {})}
        title={confirmationModalTitle}
        message={confirmationModalMessage}
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

export default CategoryDetail;
