import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { getItemById, Item } from "../services/itemService";
import {
  createIngredient,
  getAvailableItems,
  getIngredientsUsedIn,
  Ingredient,
  updateIngredient,
  deleteIngredient,
} from "../services/ingredientService";
import { getCategories, Category } from "../services/categoryService";
import ToastNotification from "../components/ToastNotification";
import ItemSearchBar from "../components/ItemSearchBar";
import ItemTable from "../components/ItemTable";
import IngredientTable from "../components/IngredientTable";
import EditItemQuantityModal from "../components/EditItemQuantityModal";
import ConfirmationModal from "../components/ConfirmationModal";

const IngredientUsedIn: React.FC = () => {
  const { ingredientId } = useParams<{ ingredientId: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | undefined>(undefined);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");

  const [sortIngredientConfig, setSortIngredientConfig] = useState<{
    key: keyof Ingredient;
    direction: "asc" | "desc";
  } | null>(null);

  const [sortItemConfig, setSortItemConfig] = useState<{
    key: keyof Item;
    direction: "asc" | "desc";
  } | null>(null);

  const [editedIngredient, setEditedIngredient] = useState<Ingredient | null>(
    null
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [ingredientToDelete, setIngredientToDelete] =
    useState<Ingredient | null>(null);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationModalTitle, setConfirmationModalTitle] =
    useState<string>("");
  const [confirmationModalMessage, setConfirmationModalMessage] =
    useState<string>("");
  const [originalIngredient, setOriginalIngredient] =
    useState<Ingredient | null>(null);

  useEffect(() => {
    if (!ingredientId) return;

    const fetchData = async () => {
      try {
        const [
          fetchedItem,
          fetchedIngredients,
          fetchedAvailableItems,
          fetchedCategories,
        ] = await Promise.all([
          getItemById(Number(ingredientId)),
          getIngredientsUsedIn(Number(ingredientId)),
          getAvailableItems(Number(ingredientId)),
          getCategories(),
        ]);

        setItem(fetchedItem);
        setIngredients(fetchedIngredients);
        setAvailableItems(fetchedAvailableItems);
        setCategories(fetchedCategories);
        setSelectedCategories(fetchedCategories.map((c) => c.category_id!));
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(error.message || "Failed to fetch data.");
        setShowToast(true);
      }
    };

    fetchData();
  }, [ingredientId]);

  const filteredItems = useMemo(() => {
    const filtered = availableItems.filter((item) => {
      const matchesSearch =
        item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.item_description
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategories.includes(item.category_id!);
      return matchesSearch && matchesCategory;
    });

    if (!sortItemConfig) return filtered;

    const { key, direction } = sortItemConfig;
    return [...filtered].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [availableItems, searchQuery, selectedCategories, sortItemConfig]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      availableItems.some((item) => item.category_id === category.category_id)
    );
  }, [categories, availableItems]);

  const handleSelectItem = (item: Item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowEditModal(true);
  };

  const applyIngredientSorting = useCallback(
    (data: Ingredient[]) => {
      if (!sortIngredientConfig) return data;

      const { key, direction } = sortIngredientConfig;
      return [...data].sort((a, b) => {
        if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
        if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
        return 0;
      });
    },
    [sortIngredientConfig]
  );

  const handleSaveQuantity = async () => {
    if (!selectedItem || !item) return;

    if (quantity <= 0) {
      setToastVariant("danger");
      setToastMessage("Quantity must be greater than 0.");
      setShowToast(true);
      return;
    }

    try {
      await createIngredient(selectedItem.item_id!, item.item_id!, quantity);
      setToastVariant("success");
      setToastMessage(
        `Successfully added ${quantity} of ${selectedItem.item_name} as an ingredient.`
      );
      setShowToast(true);
      setShowEditModal(false);

      const [updatedIngredients, updatedAvailableItems] = await Promise.all([
        getIngredientsUsedIn(item.item_id!),
        getAvailableItems(item.item_id!),
      ]);
      setIngredients(applyIngredientSorting(updatedIngredients));
      setAvailableItems(updatedAvailableItems);
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Failed to add ingredient.");
      setShowToast(true);
    }
  };

  const handleItemSort = (key: keyof Item) => {
    let direction: "asc" | "desc" = "asc";
    if (sortItemConfig?.key === key && sortItemConfig.direction === "asc") {
      direction = "desc";
    }
    setSortItemConfig({ key, direction });
  };

  const handleEditIngredient = (ingredient: Ingredient) => {
    if (
      editedIngredient &&
      originalIngredient &&
      editedIngredient.item_id !== ingredient.item_id &&
      JSON.stringify(editedIngredient) !== JSON.stringify(originalIngredient)
    ) {
      const userConfirmed = window.confirm(
        "You have unsaved changes. Do you want to discard them?"
      );
      if (!userConfirmed) {
        return;
      }
    }

    setEditedIngredient({ ...ingredient });
    setOriginalIngredient({ ...ingredient });
  };

  const handleCancelEdit = () => {
    setEditedIngredient(null);
    setOriginalIngredient(null);
  };

  const handleSaveEditedIngredient = async () => {
    if (!item || !editedIngredient) return;

    if (
      JSON.stringify(editedIngredient) === JSON.stringify(originalIngredient)
    ) {
      setToastVariant("info");
      setToastMessage("No changes were made to the item.");
      setShowToast(true);
      return;
    }

    try {
      await updateIngredient(
        editedIngredient!.item_id!,
        item!.item_id!,
        editedIngredient!.quantity!
      );
      setToastVariant("success");
      setToastMessage("Ingredient updated successfully.");
      setShowToast(true);
      setEditedIngredient(null);
      setOriginalIngredient(null);

      const [updatedIngredients, updatedAvailableItems] = await Promise.all([
        getIngredientsUsedIn(item!.item_id!),
        getAvailableItems(item!.item_id!),
      ]);
      setIngredients(applyIngredientSorting(updatedIngredients));
      setAvailableItems(updatedAvailableItems);
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Failed to update ingredient.");
      setShowToast(true);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
    setIngredientToDelete(null);
  };

  const handleRemoveIngredient = (ingredient: Ingredient) => {
    setIngredientToDelete(ingredient);
    setConfirmationModalTitle("Remove Ingredient");
    setConfirmationModalMessage(
      `Are you sure you want to remove ${ingredient.item_name} from ingredients?`
    );
    setConfirmAction(() => () => handleDeleteConfirmIngredient(ingredient));
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirmIngredient = async (ingredient: Ingredient) => {
    if (!item) return;

    try {
      await deleteIngredient(ingredient.item_id!, item.item_id!);
      const [updatedIngredients, updatedAvailableItems] = await Promise.all([
        getIngredientsUsedIn(item.item_id!),
        getAvailableItems(item.item_id!),
      ]);
      setIngredients(applyIngredientSorting(updatedIngredients));
      setAvailableItems(updatedAvailableItems);

      setToastVariant("success");
      setToastMessage("Ingredient removed successfully.");
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(error.message || "Failed to remove ingredient.");
    }

    setShowToast(true);
    setShowConfirmDialog(false);
    setIngredientToDelete(null);
  };

  const handleIngredientSort = (key: keyof Ingredient) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortIngredientConfig?.key === key &&
      sortIngredientConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedIngredients = [...ingredients].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setIngredients(sortedIngredients);
    setSortIngredientConfig({ key, direction });
  };

  return (
    <div className="container mt-4">
      {item ? (
        <>
          <h2>Ingredient Usage: {item.item_name}</h2>

          <h4 className="mt-4">List of Items</h4>
          {ingredients.length === 0 ? (
            <p>No Items are assigned.</p>
          ) : (
            <IngredientTable
              ingredients={ingredients}
              editedIngredient={editedIngredient}
              sortConfig={sortIngredientConfig}
              mode="edit"
              onEditIngredient={handleEditIngredient}
              onSaveIngredient={handleSaveEditedIngredient}
              onCancelEdit={handleCancelEdit}
              onSort={handleIngredientSort}
              setEditedIngredient={setEditedIngredient}
              navigateToDetail={(id: number) => navigate(`/item-detail/${id}`)}
              onSelectIngredient={() => {}}
              showRemoveButton={true}
              onRemoveIngredient={handleRemoveIngredient}
            />
          )}

          <h4 className="mt-4">
            Select Item to Add as Ingredient for {item.item_name}
          </h4>
          <ItemSearchBar
            searchQuery={searchQuery}
            onSearchChange={(e) => setSearchQuery(e.target.value)}
            onAddItemClick={() => navigate("/add-item")}
            categories={filteredCategories}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          <ItemTable
            items={filteredItems}
            editedItem={null}
            sortConfig={sortItemConfig}
            onEditItem={() => {}}
            onSaveItem={() => {}}
            onCancelEdit={() => {}}
            onSort={handleItemSort}
            setEditedItem={() => {}}
            navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
            mode="display"
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
        </>
      ) : (
        <p>Loading item data...</p>
      )}

      <ConfirmationModal
        show={showConfirmDialog}
        onHide={handleDeleteCancel}
        onConfirm={confirmAction ?? (() => {})}
        title={confirmationModalTitle}
        message={confirmationModalMessage}
        cancelButtonLabel="No, Cancel"
        confirmButtonLabel="Yes, Remove"
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

export default IngredientUsedIn;
