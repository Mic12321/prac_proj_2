import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface ItemFormProps {
  initialData?: {
    name: string;
    description: string;
    stock_quantity: number;
    unit_name: string;
    low_stock_quantity?: number;
    price: number;
    menu_category_id: number;
    for_sale: boolean;
    picture?: File | null;
  };
  onSubmit: (data: any) => void;
}

const ItemForm: React.FC<ItemFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      description: "",
      stock_quantity: 0,
      unit_name: "",
      low_stock_quantity: 0,
      price: 0,
      menu_category_id: 1,
      for_sale: true,
      picture: null,
    }
  );

  const [categories, setCategories] = useState([
    { id: 1, name: "Fruits" },
    { id: 2, name: "Vegetables" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;

    if (type === "number") {
      newValue = parseFloat(value);
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

  const handleCategorySubmit = () => {
    const trimmedCategory = newCategory.trim();
    if (!trimmedCategory) return;

    const categoryExists = categories.some(
      (category) =>
        category.name.toLowerCase() === trimmedCategory.toLowerCase()
    );

    if (!categoryExists) {
      const newCategoryObj = {
        id: categories.length + 1,
        name: trimmedCategory,
      };
      setCategories([...categories, newCategoryObj]);
      setFormData({ ...formData, menu_category_id: newCategoryObj.id });
    }

    setNewCategory("");
    setShowModal(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, menu_category_id: Number(e.target.value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-3">
        <label className="form-label">Item Name</label>
        <input
          type="text"
          name="name"
          className="form-control"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          name="description"
          className="form-control"
          value={formData.description}
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
          name="menu_category_id"
          className="form-control"
          value={formData.menu_category_id}
          onChange={handleCategoryChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
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

      <button type="submit" className="btn btn-primary">
        Save Item
      </button>

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
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Enter category name"
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
