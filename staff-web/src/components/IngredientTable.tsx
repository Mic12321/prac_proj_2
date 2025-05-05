import React from "react";
import { Item } from "../services/itemService";
import { Ingredient } from "../services/ingredientService";

interface IngredientTableProps {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  sortConfig: { key: keyof Ingredient; direction: string } | null;
  onEditIngredient: (item: Ingredient) => void;
  onSaveIngredient: () => void;
  onCancelEdit: () => void;
  onSort: (key: keyof Ingredient) => void;
  setEditedIngredient: React.Dispatch<React.SetStateAction<Ingredient | null>>;
  navigateToDetail: (id: number) => void;
  mode: "edit" | "display" | "select";
  onSelectIngredient: (ingredient: Ingredient) => void;
  showRemoveButton: boolean;
  onRemoveIngredient: (ingredient: Ingredient) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  editedIngredient,
  sortConfig,
  onEditIngredient,
  onSaveIngredient,
  onCancelEdit,
  onSort,
  setEditedIngredient,
  navigateToDetail,
  mode,
  onSelectIngredient,
  showRemoveButton,
  onRemoveIngredient,
}) => {
  // if (!ingredients || ingredients.length === 0)
  //   return <p>No ingredients found.</p>;
  // if (mode === "edit" && editedIngredient === null)
  //   return <p>Preparing to edit...</p>;

  return (
    <table className="table table-striped table-bordered">
      <thead>
        <tr>
          {["item_name", "quantity", "unit_name"].map((key) => (
            <th
              key={key}
              onClick={() => onSort(key as keyof Ingredient)}
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
        {ingredients.map((ingredient) => (
          <tr key={ingredient.item_id}>
            {editedIngredient?.item_id === ingredient.item_id ? (
              <>
                {/* <td>
                  <input
                    type="text"
                    className="form-control"
                    value={editedIngredient!.item_name}
                    onChange={(e) =>
                      setEditedIngredient((prev) =>
                        prev ? { ...prev, item_name: e.target.value } : prev
                      )
                    }
                  />
                </td> */}
                <td>{ingredient.item_name}</td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    value={editedIngredient!.quantity ?? ""}
                    onChange={(e) =>
                      setEditedIngredient((prev) =>
                        prev
                          ? {
                              ...prev,
                              quantity: parseFloat(e.target.value) || 0,
                            }
                          : prev
                      )
                    }
                  />
                </td>
                <td>{ingredient.unit_name}</td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-success btn-sm"
                      onClick={onSaveIngredient}
                    >
                      Save
                    </button>
                    <button
                      type="button"
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
                <td>{ingredient.item_name}</td>
                <td>
                  {typeof ingredient.quantity === "number"
                    ? ingredient.quantity.toFixed(2)
                    : ingredient.quantity}
                </td>
                <td>{ingredient.unit_name}</td>

                <td>
                  <div className="d-flex gap-2">
                    {mode === "edit" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => onEditIngredient(ingredient)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigateToDetail(ingredient.item_id!)}
                        >
                          View Details
                        </button>
                        {showRemoveButton && (
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => onRemoveIngredient(ingredient)}
                          >
                            Remove
                          </button>
                        )}
                      </>
                    )}

                    {mode === "display" && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigateToDetail(ingredient.item_id!)}
                      >
                        View Details
                      </button>
                    )}

                    {mode === "select" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-success btn-sm"
                          onClick={() => onSelectIngredient(ingredient)}
                        >
                          Select
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigateToDetail(ingredient.item_id!)}
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

export default IngredientTable;
