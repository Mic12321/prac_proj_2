import React from "react";

interface CategoryButtonProps {
  label: string;
  displayName: string;
  onClick: () => void;
  selected?: boolean;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  label,
  displayName,
  onClick,
  selected = false,
}) => {
  return (
    <div className="col-6 col-md-3 mt-2">
      <button
        className={`btn w-100 shadow p-3 ${
          selected ? "btn-primary" : "btn-light"
        }`}
        onClick={onClick}
      >
        <p className="mt-2 fw-bold mb-0">{displayName}</p>
      </button>
    </div>
  );
};

export default CategoryButton;
