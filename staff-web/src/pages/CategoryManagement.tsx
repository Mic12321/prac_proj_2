import React, { useState, useEffect, useCallback } from "react";
import { getAllItems, getItemById, Item } from "../services/itemService";
import IngredientSelector from "../components/IngredientSelector";
import ToastNotification from "../components/ToastNotification";
import {
  Category,
  getCategories,
  updateCategory,
} from "../services/categoryService";
import CategoryTable from "../components/CategoryTable";

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Category;
    direction: string;
  } | null>(null);

  const [editedCategory, setEditedCategory] = useState<Category | null>(null);
  const [originalCategory, setOriginalCategory] = useState<Category | null>(
    null
  );

  const handleComplete = (ingredient: Item, quantity: number) => {
    console.log("hi");
  };

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
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

  const handleSaveCategory = async () => {
    if (editedCategory) {
      if (JSON.stringify(editedCategory) === JSON.stringify(originalCategory)) {
        setToastVariant("info");
        setToastMessage("No changes were made to the item.");
        setShowToast(true);
        return;
      }
      try {
        const updatedCategories = categories.map((category) =>
          category.category_id === editedCategory.category_id
            ? { ...category, ...editedCategory }
            : category
        );
        setCategories(updatedCategories);
        setFilteredCategories(updatedCategories);

        const updatedCategory = await updateCategory(
          editedCategory.category_id!,
          editedCategory
        );

        setEditedCategory(null);
        setToastVariant("success");
        setToastMessage("Category updated successfully!");
        setShowToast(true);
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message || "Failed to update category. Please try again."
        );
        setShowToast(true);
      }
    }
  };

  const handleCancelEdit = () => {
    if (originalCategory) {
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.category_id === originalCategory.category_id
            ? originalCategory
            : category
        )
      );
    }
    setEditedCategory(null);
    setOriginalCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    if (editedCategory && editedCategory.category_id !== category.category_id) {
      if (
        originalCategory &&
        JSON.stringify(editedCategory) !== JSON.stringify(originalCategory)
      ) {
        const userConfirmed = window.confirm(
          "You have unsaved changes. Do you want to discard them?"
        );
        if (!userConfirmed) {
          return;
        }
      }
    }

    setOriginalCategory({ ...category });
    setEditedCategory(category);
  };

  return (
    <div className="container mt-4">
      <h2>Category Management</h2>

      {categories.length > 0 ? (
        <CategoryTable
          categories={filteredCategories}
          editedCategory={editedCategory}
          sortConfig={sortConfig}
          onEditCategory={handleEditCategory}
          onSaveCategory={handleSaveCategory}
          onCancelEdit={handleCancelEdit}
          onSort={handleSort}
          setEditedCategory={setEditedCategory}
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
