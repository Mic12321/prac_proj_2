import React, { useState, useEffect, useCallback } from "react";
import ToastNotification from "../components/ToastNotification";
import {
  addCategory,
  Category,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../services/categoryService";
import CategoryTable from "../components/CategoryTable";
import AddCategoryModal from "../components/AddCategoryModal";
import { useNavigate } from "react-router";
import ConfirmationModal from "../components/ConfirmationModal";
import { applySort } from "../utils/sorting";

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

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmationModalTitle, setConfirmationModalTitle] =
    useState<string>("");
  const [confirmationModalMessage, setConfirmationModalMessage] =
    useState<string>("");

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

  useEffect(() => {
    if (sortConfig && sortConfig.key) {
      setFilteredCategories(
        applySort(
          [...categories],
          sortConfig?.key,
          sortConfig?.direction as "asc" | "desc"
        )
      );
    } else {
      setFilteredCategories(categories);
    }
  }, [categories, sortConfig]);

  useEffect(() => {
    const message = sessionStorage.getItem("successMessage");
    if (message) {
      setToastVariant("success");
      setToastMessage(message);
      setShowToast(true);
      sessionStorage.removeItem("successMessage");
    }
  }, []);

  const handleSort = (key: keyof Category) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig?.key === key && sortConfig.direction === "asc")
      direction = "desc";

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
        const updateSuccess = await updateCategory(
          editedCategory.category_id!,
          editedCategory
        );

        if (updateSuccess) {
          const updatedCategories = categories.map((category) =>
            category.category_id === editedCategory.category_id
              ? { ...category, ...editedCategory }
              : category
          );
          setCategories(updatedCategories);

          setEditedCategory(null);
          setToastVariant("success");
          setToastMessage("Category updated successfully!");
          setShowToast(true);
        }
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
        if (!userConfirmed) return;
      }
    }
    setOriginalCategory({ ...category });
    setEditedCategory(category);
  };

  const handleRemoveCategory = (category: Category) => {
    if (category.linked_item_quantity! > 0) {
      setToastVariant("danger");
      setToastMessage("Cannot delete category with linked items.");
      setShowToast(true);
      return;
    }
    setConfirmationModalTitle("Delete Category");
    setConfirmationModalMessage(
      `Are you sure you want to delete the category "${category.category_name}"?`
    );
    setConfirmAction(() => () => handleDeleteConfirmCategory(category));
    setShowConfirmDialog(true);
  };

  const handleDeleteConfirmCategory = async (category: Category) => {
    if (category.linked_item_quantity! > 0) {
      setToastVariant("danger");
      setToastMessage("Cannot delete category with linked items.");
      setShowToast(true);
      return;
    }

    try {
      setShowConfirmDialog(false);
      const deletionSuccess = await deleteCategory(category.category_id!);
      if (deletionSuccess) {
        const updatedCategories = categories.filter(
          (item) => item.category_id !== category.category_id
        );
        setCategories(updatedCategories);

        setToastVariant("success");
        setToastMessage("Category deleted successfully!");
        setShowToast(true);
      } else {
        setToastVariant("danger");
        setToastMessage("Failed to delete category. Please try again.");
        setShowToast(true);
      }
    } catch (error: any) {
      setToastVariant("danger");
      setToastMessage(
        error.message || "Failed to delete category. Please try again."
      );
      setShowToast(true);
    }
  };

  const handleDeleteCancel = () => {
    setShowConfirmDialog(false);
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
        const addSuccess = await addCategory({
          category_name: trimmedCategory,
          category_description: trimmedDescription,
        });

        const updatedList = await getCategories();
        setCategories(updatedList);
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
          onRemoveCategory={handleRemoveCategory}
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
    </div>
  );
};

export default CategoryManagement;
