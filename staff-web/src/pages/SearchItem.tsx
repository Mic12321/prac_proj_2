import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import { getAllItems, updateItem, Item } from "../services/itemService";
import { getCategories, Category } from "../services/categoryService";
import NavigateButton from "../components/NavigateButton";
import ToastNotification from "../components/ToastNotification";
import ItemSearchBar from "../components/ItemSearchBar";
import ItemTable from "../components/ItemTable";
import { applySort } from "../utils/sorting";

const SearchItem: React.FC = () => {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: "asc" | "desc";
  } | null>(null);
  const [originalItem, setOriginalItem] = useState<Item | null>(null);

  const [isEditing, setIsEditing] = useState(true);

  const customClassCategoryFilterDropdown = "ms-2";

  const fetchData = useCallback(async () => {
    try {
      const [categoriesData, itemsData] = await Promise.all([
        getCategories(),
        getAllItems(),
      ]);

      setCategories(categoriesData);
      setSelectedCategories(categoriesData.map((c) => c.category_id!));

      const updatedItems: Item[] = itemsData.map((item: any) => ({
        ...item,
        category_name:
          categoriesData.find((cat) => cat.category_id === item.category_id)
            ?.category_name || "",
        picture:
          item.picture instanceof File
            ? URL.createObjectURL(item.picture)
            : item.picture ?? undefined,
      }));

      setItems(updatedItems);
    } catch (error) {
      setToastVariant("danger");
      setToastMessage("Failed to fetch data. Please try again.");
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const message = sessionStorage.getItem("successMessage");
    if (message) {
      setToastVariant("success");
      setToastMessage(message);
      setShowToast(true);
      sessionStorage.removeItem("successMessage");
    }

    const filtered = items.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.category_name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.includes(item.category_id!);

      return matchesSearch && matchesCategory;
    });

    if (sortConfig && sortConfig.key) {
      setFilteredItems(
        applySort(
          [...filtered],
          sortConfig.key,
          sortConfig.direction as "asc" | "desc"
        )
      );
    } else {
      setFilteredItems(filtered);
    }
  }, [searchQuery, items, selectedCategories, sortConfig]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

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
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      items.some((item) => item.category_id === category.category_id)
    );
  }, [categories, items]);

  return (
    <div className="container mt-4">
      {/* <NavigateButton
        navUrl="/stock-management"
        displayName="<- Back to stock management page"
      /> */}
      <h1>Search and Edit Items</h1>

      <ItemSearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onAddItemClick={() => navigate("/add-item")}
        categories={filteredCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <ItemTable
        items={filteredItems}
        editedItem={editedItem}
        sortConfig={sortConfig}
        onEditItem={handleEditItem}
        onSaveItem={handleSaveItem}
        onCancelEdit={handleCancelEdit}
        onSort={handleSort}
        setEditedItem={setEditedItem}
        navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
        isEditing={isEditing}
        onSelectItem={() => {}}
        showRemoveButton={false}
        onRemoveItem={() => {}}
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

export default SearchItem;
