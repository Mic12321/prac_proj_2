import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { getCategories, addCategory } from "../services/categoryService";
import { Item } from "../services/itemService";
import { Ingredient } from "../services/ingredientService";
import IngredientTable from "./IngredientTable";
import { useNavigate } from "react-router";
import AddCategoryModal from "./AddCategoryModal";

interface ItemFormProps {
  initialData?: Item;
  onSubmit: (data: Item) => void;
  onError: (message: string) => void;
  onDelete?: (id: number) => void;
  itemIngredients?: Ingredient[];
  itemIngredientsUsedIn?: Ingredient[];
}

const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  onSubmit,
  onError,
  onDelete,
  itemIngredients = [],
  itemIngredientsUsedIn = [],
}) => {
  const [formData, setFormData] = useState<Item>({
    item_name: "",
    item_description: "",
    stock_quantity: 0.0,
    unit_name: "",
    low_stock_quantity: 0.0,
    price: 0.0,
    category_id: 0,
    for_sale: true,
    picture: null,
    ...initialData,
  });

  const [categories, setCategories] = useState<
    {
      category_id: number;
      category_name: string;
      category_description: string;
    }[]
  >([]);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newCategory, setNewCategory] = useState<string>("");
  const [newCategoryDescription, setNewCategoryDescription] =
    useState<string>("");
  const [categoryNameError, setCategoryNameError] = useState<string>("");

  const [sortConfigItemIngredients, setSortConfigItemIngredients] = useState<{
    key: keyof Ingredient;
    direction: "asc" | "desc";
  } | null>(null);

  const [sortConfigUsedIn, setSortConfigUsedIn] = useState<{
    key: keyof Ingredient;
    direction: "asc" | "desc";
  } | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        item_name: initialData.item_name ?? "",
        item_description: initialData.item_description ?? "",
        stock_quantity: initialData.stock_quantity ?? 0.0,
        unit_name: initialData.unit_name ?? "",
        low_stock_quantity: initialData.low_stock_quantity ?? 0.0,
        price: initialData.price ?? 0.0,
        category_id: initialData.category_id ?? 0,
        for_sale: initialData.for_sale ?? true,
        picture: initialData.picture ?? null,
      });

      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [initialData]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const categoryData = await getCategories();

        if (categoryData.length === 0) {
          return;
        }

        setCategories(
          categoryData.map((category) => ({
            ...category,
            category_id: category.category_id ?? 0,
          }))
        );

        setFormData((prevFormData) => ({
          ...prevFormData,
          category_id:
            (prevFormData.category_id || categoryData[0].category_id) ?? 0,
        }));
      } catch (error: any) {
        onError(
          error.message || "Failed to load categories. Please try again."
        );
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === "number") {
      newValue = parseFloat(value);
      if (isNaN(newValue)) {
        newValue = 0;
      }
    } else if (name === "for_sale") {
      newValue = value === "true";
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, picture: e.target.files[0] });
    }
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

        if (newCategoryObj) {
          setCategories((prevCategories) => [
            ...prevCategories,
            { ...newCategoryObj, category_id: newCategoryObj.category_id ?? 0 },
          ]);
          setFormData({
            ...formData,
            category_id: newCategoryObj.category_id ?? 0,
          });
        }
      }

      // TODO Display message about category already exists.
    } catch (error: any) {
      onError(error.message || "Failed to add categories. Please try again.");
    }

    setNewCategory("");
    setNewCategoryDescription("");
    setShowModal(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, category_id: Number(e.target.value) });
  };

  const selectedCategory = categories.find(
    (category) => category.category_id === formData.category_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    if (!formData.category_id || formData.category_id === 0) {
      onError("Please select a valid category before saving the item.");
      e.preventDefault();
      return;
    }

    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error: any) {}
  };

  const handleToModifyIngredientForItem = () => {
    navigate(`/item/${formData.item_id}/ingredients`);
  };

  const handleToModifyIngredientForItemUsingThisIngredient = () => {
    navigate(`/ingredient/${formData.item_id}`);
  };

  const handleSortItemIngredients = (key: keyof Ingredient) => {
    let direction: "asc" | "desc" = "asc";
    if (
      sortConfigItemIngredients?.key === key &&
      sortConfigItemIngredients.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfigItemIngredients({ key, direction });
  };

  const handleSortUsedIn = (key: keyof Ingredient) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfigUsedIn?.key === key && sortConfigUsedIn.direction === "asc") {
      direction = "desc";
    }
    setSortConfigUsedIn({ key, direction });
  };

  const sortedItemIngredients = useMemo(() => {
    if (!sortConfigItemIngredients) return itemIngredients;
    const { key, direction } = sortConfigItemIngredients;
    return [...itemIngredients].sort((a, b) =>
      a[key]! < b[key]!
        ? direction === "asc"
          ? -1
          : 1
        : a[key]! > b[key]!
        ? direction === "asc"
          ? 1
          : -1
        : 0
    );
  }, [itemIngredients, sortConfigItemIngredients]);

  const sortedItemIngredientsUsedIn = useMemo(() => {
    if (!sortConfigUsedIn) return itemIngredientsUsedIn;
    const { key, direction } = sortConfigUsedIn;
    return [...itemIngredientsUsedIn].sort((a, b) =>
      a[key]! < b[key]!
        ? direction === "asc"
          ? -1
          : 1
        : a[key]! > b[key]!
        ? direction === "asc"
          ? 1
          : -1
        : 0
    );
  }, [itemIngredientsUsedIn, sortConfigUsedIn]);

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-3">
        <label className="form-label">Item Name</label>
        <input
          type="text"
          name="item_name"
          className="form-control"
          value={formData.item_name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Item Description</label>
        <textarea
          name="item_description"
          className="form-control"
          value={formData.item_description}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Stock Quantity</label>
        <input
          type="number"
          name="stock_quantity"
          className="form-control"
          value={
            formData.stock_quantity !== null &&
            formData.stock_quantity !== undefined
              ? Number(formData.stock_quantity).toFixed(2)
              : ""
          }
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Unit Name</label>
        <input
          type="text"
          name="unit_name"
          className="form-control"
          value={formData.unit_name}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Low Stock Quantity</label>
        <input
          type="number"
          name="low_stock_quantity"
          className="form-control"
          value={
            formData.low_stock_quantity !== null &&
            formData.low_stock_quantity !== undefined
              ? Number(formData.low_stock_quantity).toFixed(2)
              : ""
          }
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={
            formData.price !== null && formData.price !== undefined
              ? Number(formData.price).toFixed(2)
              : ""
          }
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category</label>
        <select
          name="category_id"
          className="form-control"
          value={formData.category_id!}
          onChange={handleCategoryChange}
          required
        >
          {categories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.category_name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-link text-primary mt-2"
          onClick={() => setShowModal(true)}
        >
          Create a new category
        </button>

        {selectedCategory && (
          <p className="mt-2 text-muted">
            <strong>Description:</strong>{" "}
            {selectedCategory.category_description}
          </p>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">For Sale</label>
        <select
          name="for_sale"
          className="form-control"
          value={formData.for_sale ? "true" : "false"}
          onChange={handleChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Upload Picture</label>
        <input
          type="file"
          name="picture"
          className="form-control"
          onChange={handleFileChange}
        />
      </div>
      <div className="mt-4">
        <h4>Item Ingredients</h4>
        {itemIngredients.length > 0 ? (
          <IngredientTable
            ingredients={sortedItemIngredients}
            mode={"display"}
            onSaveIngredient={() => {}}
            onCancelEdit={() => {}}
            editedIngredient={null}
            onSort={handleSortItemIngredients}
            setEditedIngredient={() => {}}
            showRemoveButton={false}
            onRemoveIngredient={() => {}}
            sortConfig={sortConfigItemIngredients}
            onEditIngredient={() => {}}
            onSelectIngredient={() => {}}
            navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
          />
        ) : (
          <p>No ingredients available for this item.</p>
        )}
        {initialData?.item_id !== undefined ? (
          <button
            type="button"
            className="btn btn-info mt-3"
            onClick={handleToModifyIngredientForItem}
          >
            Modify Ingredient
          </button>
        ) : (
          <p className="text-muted">
            Please add ingredients after adding this new item
          </p>
        )}
      </div>

      <div className="mt-4">
        <h4>Items Using This Ingredient</h4>
        {itemIngredientsUsedIn.length > 0 ? (
          <IngredientTable
            ingredients={sortedItemIngredientsUsedIn}
            mode={"display"}
            onSaveIngredient={() => {}}
            onCancelEdit={() => {}}
            editedIngredient={null}
            onSort={handleSortUsedIn}
            setEditedIngredient={() => {}}
            showRemoveButton={false}
            onRemoveIngredient={() => {}}
            sortConfig={sortConfigUsedIn}
            onEditIngredient={() => {}}
            onSelectIngredient={() => {}}
            navigateToDetail={(id) => navigate(`/item-detail/${id}`)}
          />
        ) : (
          <p>No items used this ingredient.</p>
        )}
        {initialData?.item_id !== undefined ? (
          <button
            type="button"
            className="btn btn-info mt-3"
            onClick={handleToModifyIngredientForItemUsingThisIngredient}
          >
            Modify Ingredient
          </button>
        ) : (
          <p className="text-muted">
            Please add ingredients after adding this new item
          </p>
        )}
      </div>

      <div className="border-top my-3"></div>

      <button type="submit" className="btn btn-primary">
        Save Item
      </button>
      {initialData && onDelete && (
        <button
          type="button"
          className="btn btn-danger ms-2"
          onClick={() => onDelete(initialData.item_id!)}
        >
          Delete Item
        </button>
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
    </form>
  );
};

export default ItemForm;
