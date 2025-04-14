import React from "react";
import CategoryFilterDropdown from "./CategoryFilterDropdown";
import { Category } from "../services/categoryService";

interface ItemSearchBarProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddItemClick: () => void;
  categories: Category[];
  selectedCategories: number[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<number[]>>;
}

const ItemSearchBar: React.FC<ItemSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  onAddItemClick,
  categories,
  selectedCategories,
  setSelectedCategories,
}) => {
  return (
    <div className="mb-4 d-flex">
      <input
        type="text"
        className="form-control me-2"
        placeholder="Search for items..."
        value={searchQuery}
        onChange={onSearchChange}
      />
      <button className="btn btn-success" onClick={onAddItemClick}>
        Add New Item
      </button>

      <CategoryFilterDropdown
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        className="ms-2"
      />
    </div>
  );
};

export default ItemSearchBar;
