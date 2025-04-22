import React, { useState, useEffect, useCallback } from "react";
import { getAllItems, getItemById, Item } from "../services/itemService";
import IngredientSelector from "../components/IngredientSelector";
import ToastNotification from "../components/ToastNotification";
import {
  addCategory,
  Category,
  getCategories,
  updateCategory,
} from "../services/categoryService";
import CategoryTable from "../components/CategoryTable";
import AddCategoryModal from "../components/AddCategoryModal";
import { useNavigate } from "react-router";

const CategoryManagement: React.FC = () => {
  const navigate = useNavigate();

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
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [newCategoryDescription, setNewCategoryDescription] =
    useState<string>("");
  const [categoryNameError, setCategoryNameError] = useState<string>("");

  const handleComplete = (ingredient: Item, quantity: number) => {
    console.log("hi");
  };

  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await getCategories();

      setCategories(categoriesData);

      let updatedCategories = [...categoriesData];

      if (sortConfig) {
        updatedCategories.sort((a, b) => {
          if (a[sortConfig.key]! < b[sortConfig.key]!)
            return sortConfig.direction === "asc" ? -1 : 1;
          if (a[sortConfig.key]! > b[sortConfig.key]!)
            return sortConfig.direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      setFilteredCategories(updatedCategories);
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

  const handleCategorySubmit = async () => {
    const trimmedCategory = newCategory.trim();
    const trimmedDescription = newCategoryDescription.trim();

    if (!trimmedCategory) {
      setCategoryNameError("Category name is required.");
      return;
    }

    setCategoryNameError("");

    try {
      const existingCategory = categories.find(
        (category) =>
          category.category_name.toLowerCase() === trimmedCategory.toLowerCase()
      );

      if (!existingCategory) {
        const newCategoryObj = await addCategory({
          category_name: trimmedCategory,
          category_description: trimmedDescription,
        });

        await fetchCategories();
      }
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(
        error.message || "Failed to add categories. Please try again."
      );
      setShowToast(true);
    }

    setNewCategory("");
    setNewCategoryDescription("");
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2>Category Management</h2>
      <button
        className="btn btn-success mt-4 mb-4"
        onClick={() => setShowModal(true)}
      >
        Create a new category
      </button>

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
          navigateToDetail={(categoryId) => {
            navigate(`/category-detail/${categoryId}`);
          }}
          isEditing={true}
          onSelectCategory={() => {}}
          showRemoveButton={true}
          onRemoveCategory={() => {}}
        />
      ) : (
        <p>No categories found.</p>
      )}
      <AddCategoryModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCategorySubmit}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newCategoryDescription={newCategoryDescription}
        setNewCategoryDescription={setNewCategoryDescription}
        categoryNameError={categoryNameError}
        setCategoryNameError={setCategoryNameError}
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

export default CategoryManagement;
