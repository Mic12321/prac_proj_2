import React from "react";
import { Category } from "../services/categoryService";

interface CategoryTableProps {
  categories: Category[];
  editedCategory: Category | null;
  sortConfig: { key: keyof Category; direction: string } | null;
  onEditCategory: (category: Category) => void;
  onSaveCategory: () => void;
  onCancelEdit: () => void;
  onSort: (key: keyof Category) => void;
  setEditedCategory: React.Dispatch<React.SetStateAction<Category | null>>;
  navigateToDetail: (id: number) => void;
  isEditing: boolean;
  onSelectCategory: (category: Category) => void;
  showRemoveButton: boolean;
  onRemoveCategory: (category: Category) => void;
}

const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  editedCategory,
  sortConfig,
  onEditCategory,
  onSaveCategory,
  onCancelEdit,
  onSort,
  setEditedCategory,
  navigateToDetail,
  isEditing,
  onSelectCategory,
  showRemoveButton,
  onRemoveCategory,
}) => {
  if (categories.length === 0) return <p>No items found.</p>;

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {[
            "category_name",
            "category_description",
            // "items_belong_quantity",
          ].map((key) => (
            <th
              key={key}
              onClick={() => onSort(key as keyof Category)}
              style={{ cursor: "pointer", minWidth: "150px" }}
            >
              {key.replace("_", " ").toUpperCase()}{" "}
              <span style={{ display: "inline-block", width: "15px" }}>
                {sortConfig?.key === key
                  ? sortConfig.direction === "asc"
                    ? "↑"
                    : "↓"
                  : " "}
              </span>
            </th>
          ))}
          <th style={{ minWidth: "100px" }}>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.category_id}>
            {editedCategory?.category_id === category.category_id ? (
              <>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCategory!.category_name}
                    onChange={(e) =>
                      setEditedCategory((prev) =>
                        prev ? { ...prev, category_name: e.target.value } : prev
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editedCategory!.category_description}
                    onChange={(e) =>
                      setEditedCategory((prev) =>
                        prev
                          ? { ...prev, category_description: e.target.value }
                          : prev
                      )
                    }
                  />
                </td>
                {/* <td>{category.items_belong_quantity}</td> */}
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={onSaveCategory}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </>
            ) : (
              <>
                <td>{category.category_name}</td>
                <td>{category.category_description}</td>
                {/* <td>{category.items_belong_quantity}</td> */}
                <td>
                  <div className="d-flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onEditCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            navigateToDetail(category.category_id!)
                          }
                        >
                          View Details
                        </button>
                        {showRemoveButton && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => onRemoveCategory(category)}
                          >
                            Remove
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => onSelectCategory(category)}
                        >
                          Select
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            navigateToDetail(category.category_id!)
                          }
                        >
                          View Details
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CategoryTable;
