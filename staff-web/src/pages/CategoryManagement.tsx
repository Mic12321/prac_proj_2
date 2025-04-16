import React, { useState, useEffect, useCallback } from "react";
import { getAllItems, getItemById, Item } from "../services/itemService";
import IngredientSelector from "../components/IngredientSelector";
import ToastNotification from "../components/ToastNotification";
import { Category, getCategories } from "../services/categoryService";
import CategoryTable from "../components/CategoryTable";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Category;
    direction: string;
  } | null>(null);

  const handleComplete = (ingredient: Item, quantity: number) => {
    console.log("hi");
  };

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
    } catch (error) {
      setToastVariant("danger");
      setToastMessage("Failed to fetch data. Please try again.");
      setShowToast(true);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSort = (key: keyof Category) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    const sortedCategories = [...categories].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredCategories(sortedCategories);
    setSortConfig({ key, direction });
  };

  return (
    <div className="container mt-4">
      <h2>Category Management</h2>

      {categories.length > 0 ? (
        <CategoryTable
          categories={categories}
          editedCategory={null}
          sortConfig={sortConfig}
          onEditCategory={() => {}}
          onSaveCategory={() => {}}
          onCancelEdit={() => {}}
          onSort={handleSort}
          setEditedCategory={() => {}}
          navigateToDetail={(id) => {}}
          isEditing={true}
          onSelectCategory={() => {}}
          showRemoveButton={true}
          onRemoveCategory={() => {}}
        />
      ) : (
        <p>No categories found.</p>
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

export default CategoryManagement;
