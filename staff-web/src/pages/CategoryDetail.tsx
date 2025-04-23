import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getCategoryById, Category } from "../services/categoryService";
import {
  deleteItem,
  getItemsByCategoryId,
  Item,
  updateItem,
} from "../services/itemService";
import ItemTable from "../components/ItemTable";
import ToastNotification from "../components/ToastNotification";
import ConfirmationModal from "../components/ConfirmationModal";

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");

  const [category, setCategory] = useState<Category | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [originalItem, setOriginalItem] = useState<Item | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: string;
  } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (categoryId) {
        setLoading(true);
        try {
          const fetchedCategory = await getCategoryById(Number(categoryId));
          const fetchedItems = await getItemsByCategoryId(Number(categoryId));

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

  const handleEditItem = (item: Item) => {
    if (editedItem && editedItem.item_id !== item.item_id) {
      if (
        originalItem &&
        JSON.stringify(editedItem) !== JSON.stringify(originalItem)
      ) {
        const userConfirmed = window.confirm(
          "You have unsaved changes. Do you want to discard them?"
        );
        if (!userConfirmed) {
          return;
        }
      }
    }

    setOriginalItem({ ...item });
    setEditedItem(item);
  };

  const handleSaveItem = async () => {
    if (editedItem) {
      if (JSON.stringify(editedItem) === JSON.stringify(originalItem)) {
        setToastVariant("info");
        setToastMessage("No changes were made to the item.");
        setShowToast(true);
        return;
      }
      try {
        const updatedItems = items.map((item) =>
          item.item_id === editedItem.item_id
            ? { ...item, ...editedItem }
            : item
        );
        setItems(updatedItems);

        const updatedItem = await updateItem(editedItem.item_id!, editedItem);

        setEditedItem(null);
        setToastVariant("success");
        setToastMessage("Item updated successfully!");
        setShowToast(true);
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message || "Failed to update item. Please try again."
        );
        setShowToast(true);
      }
    }
  };

  const handleCancelEdit = () => {
    if (originalItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.item_id === originalItem.item_id ? originalItem : item
        )
      );
    }
    setEditedItem(null);
    setOriginalItem(null);
  };

  const handleSort = (key: keyof Item) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setItems((prevItems) =>
      [...prevItems].sort((a, b) => {
        if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
        if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete !== null) {
      try {
        await deleteItem(itemToDelete);

        setItems((prevItems) =>
          prevItems.filter((item) => item.item_id !== itemToDelete)
        );

        setToastMessage("Item deleted successfully!");
        setToastVariant("success");
        setShowToast(true);
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

  const handleRemoveItem = (item: Item) => {
    setItemToDelete(item.item_id!);
    setShowConfirmDialog(true);
  };

  const navigateToDetail = (id: number) => {
    navigate(`/item-detail/${id}`);
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
      <h4 className="mt-2">{category.category_name}</h4>
      <p>{category.category_description}</p>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <h4>Items ({items.length})</h4>
      </div>

      <ItemTable
        items={items}
        editedItem={editedItem}
        sortConfig={sortConfig}
        onEditItem={handleEditItem}
        onSaveItem={handleSaveItem}
        onCancelEdit={handleCancelEdit}
        onSort={handleSort}
        setEditedItem={setEditedItem}
        navigateToDetail={navigateToDetail}
        isEditing={true}
        onSelectItem={() => {}}
        showRemoveButton={true}
        onRemoveItem={handleRemoveItem}
      />
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

export default CategoryDetail;
