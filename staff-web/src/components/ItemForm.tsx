import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { fetchCategories, addCategory } from "../services/categoryService";
import { Item } from "../services/itemService";
import { Ingredient } from "../services/ingredientService";

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
    stock_quantity: 0,
    unit_name: "",
    low_stock_quantity: 0,
    price: 0,
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

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);

        const categoryData = await fetchCategories();

        if (categoryData.length === 0) {
          throw new Error("No categories found.");
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

    console.log(newValue);
    console.log(type);

    if (type === "number") {
      newValue = parseFloat(value);
      newValue = newValue.toFixed(2);
      console.log("ho");

      console.log(newValue);
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
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error: any) {}
  };

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
          value={formData.stock_quantity}
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
          value={formData.low_stock_quantity}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Price</label>
        <input
          type="number"
          name="price"
          className="form-control"
          value={formData.price}
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
          <ul>
            {itemIngredients.map((itemIngredients, index) => (
              <li key={index}>
                {itemIngredients.name} - {itemIngredients.quantity}{" "}
                {itemIngredients.unit}
              </li>
            ))}
          </ul>
        ) : (
          <p>No ingredients available for this item.</p>
        )}
      </div>
      <div className="mt-4">
        <h4 className="mt-4">Items Using This Ingredient</h4>
        {itemIngredientsUsedIn.length > 0 ? (
          <ul>
            {itemIngredientsUsedIn.map((ingredients) => (
              <li key={ingredients.id}>
                {ingredients.name} - {ingredients.quantity} {ingredients.unit}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items used this ingredient.</p>
        )}
      </div>

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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                if (e.target.value.trim() !== "") {
                  setCategoryNameError("");
                }
              }}
              placeholder="Enter category name"
            />
            {categoryNameError && (
              <div className="text-danger mt-2">{categoryNameError}</div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category Description</Form.Label>
            <Form.Control
              as="textarea"
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              placeholder="Enter category description (Optional)"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleCategorySubmit}>
            Add Category
          </Button>
        </Modal.Footer>
      </Modal>
    </form>
  );
};

export default ItemForm;
