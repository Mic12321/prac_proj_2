import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getAllItems, Item } from "../services/itemService";
import { getCategories, Category } from "../services/categoryService";
import ItemSearchBar from "../components/ItemSearchBar";
import ItemTable from "../components/ItemTable";
import EditItemQuantityModal from "../components/EditItemQuantityModal";
import ToastNotification from "../components/ToastNotification";
import { useNavigate } from "react-router";
import { Ingredient } from "../services/ingredientService";
import IngredientTable from "./IngredientTable";

interface IngredientSelectorProps {
  mode: "assign-ingredient" | "used-in";
  currentItem: Item;
  addedItems: Ingredient[];
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
  const [sortItemConfig, setSortItemConfig] = useState<{
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

  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [originalItem, setOriginalItem] = useState<Item | null>(null);

  const [editedIngredient, setEditedIngredient] = useState<Ingredient | null>(
    null
  );
  const [originaldIngredient, setOriginalIngredient] =
    useState<Ingredient | null>(null);

  const [filteredIngredients, setFilteredIngredients] = useState<Ingredient[]>(
    []
  );
  const [sortIngredientConfig, setSortIngredientConfig] = useState<{
    key: keyof Ingredient;
    direction: string;
  } | null>(null);

  const [itemTableMode, setItemTableMode] = useState<"edit" | "display">(
    "display"
  );

  const [ingredientTableMode, setIngredientTableMode] = useState<
    "edit" | "display"
  >("display");

  const fetchCategoriesData = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
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

      // setToastVariant("success");
      // setToastMessage(
      //   `Added ${quantity} of ${selectedItem.item_name} ${
      //     mode === "assign-ingredient" ? "as ingredient" : "as usage"
      //   }.`
      // );
      // setShowToast(true);

      setSelectedItem(null);
      setQuantity(1);
      setShowEditModal(false);
    }
  };

  const handleItemSort = (key: keyof Item) => {
    let direction = "asc";
    if (
      sortItemConfig &&
      sortItemConfig.key === key &&
      sortItemConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedItems = [...filteredItems].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredItems(sortedItems);
    setSortItemConfig({ key, direction });
  };

  const handleIngredientSort = (key: keyof Ingredient) => {
    let direction = "asc";
    if (
      sortIngredientConfig &&
      sortIngredientConfig.key === key &&
      sortIngredientConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedIngredients = [...filteredIngredients].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredIngredients(sortedIngredients);
    setSortIngredientConfig({ key, direction });
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

      console.log("Saving item:", editedItem);
      setEditedItem(null);
      // try {
      //   const updatedItem = await updateItem(editedItem.item_id!, editedItem);

      //   if (updatedItem) {
      //     const updatedItems = items.map((item) =>
      //       item.item_id === editedItem.item_id
      //         ? { ...item, ...editedItem }
      //         : item
      //     );
      //     setItems(updatedItems);

      //     setEditedItem(null);
      //     setToastVariant("success");
      //     setToastMessage("Item updated successfully!");
      //     setShowToast(true);
      //   }
      // } catch (error: any) {
      //   setToastVariant("danger");
      //   setToastMessage(
      //     error.message || "Failed to update item. Please try again."
      //   );
      //   setShowToast(true);
      // }
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

  const handleRemoveItem = (item: Item) => {
    console.log("Removing item:", item);
    // setItemToDelete(item.item_id!);
    // setConfirmationModalTitle("Delete Item");
    // setConfirmationModalMessage(`Are you sure you want to delete this item?`);
    // setConfirmAction(() => () => handleDeleteConfirmItem(item.item_id!));
    // setShowConfirmDialog(true);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      items.some((item) => item.category_id === category.category_id)
    );
  }, [categories, items]);

  return (
    <div className="mt-3">
      <h4 className="mt-4">
        {mode === "assign-ingredient"
          ? `List of Ingredients for ${currentItem.item_name}`
          : `List of items that use ${currentItem.item_name} as an ingredient`}
      </h4>

      {addedItems.length === 0 ? (
        <p>
          {mode === "assign-ingredient"
            ? "No ingredients are assigned."
            : "No items are using this ingredient."}
        </p>
      ) : (
        <IngredientTable
          ingredients={addedItems}
          editedIngredient={editedIngredient}
          sortConfig={sortIngredientConfig}
          mode={ingredientTableMode}
          onSave={() => {}}
          onCancel={() => {}}
          onSort={() => {}}
          setEditedIngredient={() => {}}
          showRemoveButton={false}
          onRemoveIngredient={() => {}}
          onEditIngredient={() => {}}
        />
      )}

      <h4 className="mt-4">
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
        editedItem={editedItem}
        sortConfig={sortItemConfig}
        onEditItem={handleEditItem}
        onSaveItem={() => {}}
        onCancelEdit={() => {}}
        onSort={handleItemSort}
        setEditedItem={() => {}}
        navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
        mode={itemTableMode}
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
