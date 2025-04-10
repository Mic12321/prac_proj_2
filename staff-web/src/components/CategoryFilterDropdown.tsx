import React from "react";
import { Square, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Category } from "../services/categoryService";

interface Props {
  categories: Category[];
  selectedCategories: number[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
  className?: string;
}

const CategoryFilterDropdown: React.FC<Props> = ({
  categories,
  selectedCategories,
  setSelectedCategories,
  className = "position-relative",
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelectAll = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(categories.map((c) => c.category_id!));
    }
  };

  const handleToggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className={`position-relative ${className}`}>
      <button
        className="btn btn-outline-primary d-flex align-items-center"
        onClick={handleToggle}
      >
        Filter Categories
        {isOpen ? (
          <ChevronUp className="ms-2" size={16} />
        ) : (
          <ChevronDown className="ms-2" size={16} />
        )}
      </button>

      {isOpen && (
        <div
          className="border rounded mt-2 p-2 bg-white shadow-sm position-absolute"
          style={{
            zIndex: 1000,
            overflowY: "auto",
            width: "110%",
          }}
        >
          <div
            className="form-check mb-2"
            onClick={handleSelectAll}
            style={{ cursor: "pointer" }}
          >
            {selectedCategories.length === categories.length ? (
              <CheckSquare size={16} className="me-2" />
            ) : (
              <Square size={16} className="me-2" />
            )}
            Select All
          </div>
          {categories.map((category) => (
            <div
              key={category.category_id}
              className="form-check mb-1"
              onClick={() => handleToggleCategory(category.category_id!)}
              style={{ cursor: "pointer" }}
            >
              {selectedCategories.includes(category.category_id!) ? (
                <CheckSquare size={16} className="me-2" />
              ) : (
                <Square size={16} className="me-2" />
              )}
              {category.category_name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilterDropdown;
