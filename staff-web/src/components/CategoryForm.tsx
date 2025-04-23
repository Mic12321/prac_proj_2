import React, { useState, ChangeEvent, FormEvent } from "react";
import { Category } from "../services/categoryService";

interface CategoryFormProps {
  initialCategory: Category;
  onSubmit: (category: Category) => void;
  onDelete?: () => void;
  hasItems: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialCategory,
  onSubmit,
  onDelete,
  hasItems,
}) => {
  const [category, setCategory] = useState<Category>(initialCategory);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(category);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <div className="mb-3">
        <label className="form-label">Category Name</label>
        <input
          type="text"
          name="category_name"
          className="form-control"
          value={category.category_name}
          onChange={handleChange}
          placeholder="Enter category name"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Category Description</label>
        <textarea
          name="category_description"
          className="form-control"
          value={category.category_description}
          placeholder="Enter category description (Optional)"
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Update Category
      </button>

      {onDelete && (
        <div
          title={
            category.linked_item_quantity !== 0
              ? "Cannot remove category with linked items"
              : "Remove category"
          }
          style={{ display: "inline-block" }}
        >
          <button
            type="button"
            className="btn btn-danger ms-2"
            onClick={onDelete}
            disabled={hasItems}
          >
            Delete Category
          </button>
        </div>
      )}
    </form>
  );
};

export default CategoryForm;
