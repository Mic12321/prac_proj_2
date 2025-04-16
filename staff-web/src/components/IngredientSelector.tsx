import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAllItems, Item } from "../services/itemService";
import { fetchCategories, Category } from "../services/categoryService";
import ItemSearchBar from "../components/ItemSearchBar";
import ItemTable from "../components/ItemTable";
import EditItemQuantityModal from "../components/EditItemQuantityModal";
import ToastNotification from "../components/ToastNotification";
import { useNavigate } from "react-router";

interface IngredientSelectorProps {
  mode: "assign-ingredient" | "used-in";
  currentItem: Item;
  addedItems: Item[];
  availableItems: Item[];
  onComplete: (ingredient: Item, quantity: number) => void;
}

const IngredientSelector: React.FC<IngredientSelectorProps> = ({
  mode,
  currentItem,
  addedItems,
  availableItems,
  onComplete,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item;
    direction: string;
  } | null>(null);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");

  const fetchCategoriesData = useCallback(async () => {
    try {
      const categoriesData = await fetchCategories(); // Assuming fetchCategories is an async function that fetches category data
      setCategories(categoriesData);
      setSelectedCategories(categoriesData.map((c) => c.category_id!));
    } catch (err) {
      setToastVariant("danger");
      setToastMessage("Failed to fetch categories. Please try again.");
      setShowToast(true);
    }
  }, []);

  const updateItems = useCallback(async () => {
    try {
      if (categories.length === 0) return;

      const updatedItems = availableItems.map((item: Item) => ({
        ...item,
        category_name:
          categories.find((cat) => cat.category_id === item.category_id)
            ?.category_name || "",
        picture:
          item.picture instanceof File
            ? URL.createObjectURL(item.picture)
            : item.picture ?? null,
      }));

      setItems(updatedItems);
      setFilteredItems(updatedItems);
    } catch (err) {
      setToastVariant("danger");
      setToastMessage("Failed to update items. Please try again.");
      setShowToast(true);
    }
  }, [categories, availableItems]);

  useEffect(() => {
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
    setFilteredItems(filtered);
  }, [searchQuery, items, selectedCategories]);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowEditModal(true);
  };

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  useEffect(() => {
    updateItems();
  }, [updateItems, availableItems, categories]);

  const handleSaveQuantity = () => {
    if (selectedItem) {
      onComplete(selectedItem, quantity);

      setToastVariant("success");
      setToastMessage(
        `Added ${quantity} of ${selectedItem.item_name} ${
          mode === "assign-ingredient" ? "as ingredient" : "as usage"
        }.`
      );
      setShowToast(true);

      setSelectedItem(null);
      setQuantity(1);
      setShowEditModal(false);
    }
  };

  const handleSort = (key: keyof Item) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sortedItems);
    setSortConfig({ key, direction });
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      items.some((item) => item.category_id === category.category_id)
    );
  }, [categories, items]);

  return (
    <div className="mt-3">
      <h4>
        {mode === "assign-ingredient"
          ? "Select item to use as ingredient"
          : "Select where this item is used as an ingredient"}
      </h4>

      <ItemSearchBar
        searchQuery={searchQuery}
        onSearchChange={(e) => setSearchQuery(e.target.value)}
        onAddItemClick={() => {}}
        categories={filteredCategories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
      />

      <ItemTable
        items={filteredItems}
        //
        editedItem={null}
        sortConfig={sortConfig}
        onEditItem={() => {}}
        onSaveItem={() => {}}
        onCancelEdit={() => {}}
        onSort={handleSort}
        setEditedItem={() => {}}
        navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
        isEditing={false}
        onSelectItem={handleSelectItem}
        showRemoveButton={false}
        onRemoveItem={() => {}}
      />

      <EditItemQuantityModal
        show={showEditModal}
        itemName={selectedItem?.item_name || ""}
        quantity={quantity}
        onQuantityChange={setQuantity}
        onClose={() => setShowEditModal(false)}
        onSave={handleSaveQuantity}
      />

      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant={toastVariant}
        delay={3000}
      />
    </div>
  );
};

export default IngredientSelector;
