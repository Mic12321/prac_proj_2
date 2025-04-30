import React, { useState, useEffect } from "react";
import { Ingredient } from "../services/ingredientService";

interface IngredientTableProps {
  ingredients: Ingredient[];
  editedIngredient: Ingredient | null;
  mode: "edit" | "display";
  onSave: (newIngredients: Ingredient[]) => void;
  onCancel: () => void;
  onSort: (key: keyof Ingredient) => void;
  setEditedIngredient: React.Dispatch<React.SetStateAction<Ingredient | null>>;
  showRemoveButton: boolean;
  onRemoveIngredient: (ingredient: Ingredient) => void;
  sortConfig: { key: keyof Ingredient; direction: string } | null;
  onEditIngredient: (ingredient: Ingredient) => void;
}

const IngredientTable: React.FC<IngredientTableProps> = ({
  ingredients,
  editedIngredient,
  mode,
  onSave,
  onCancel,
}) => {
  const [localIngredients, setLocalIngredients] =
    useState<Ingredient[]>(ingredients);

  useEffect(() => {
    setLocalIngredients(ingredients);
  }, [ingredients]);

  const handleInputChange = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = [...localIngredients];
    updated[index] = {
      ...updated[index],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setLocalIngredients(updated);
  };

  const handleSave = () => {
    onSave(localIngredients);
  };

  return (
    <div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ITEM NAME</th>
            <th>QUANTITY</th>
            <th>UNIT NAME</th>
          </tr>
        </thead>
        <tbody>
          {localIngredients.map((ingredient, index) => (
            <tr key={index}>
              {(() => {
                switch (mode) {
                  case "edit":
                    return (
                      <>
                        <td>
                          <input
                            type="text"
                            value={ingredient.item_name}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "item_name",
                                e.target.value
                              )
                            }
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={ingredient.quantity}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={ingredient.unit_name}
                            onChange={(e) =>
                              handleInputChange(
                                index,
                                "unit_name",
                                e.target.value
                              )
                            }
                            className="form-control"
                          />
                        </td>
                        {/* <td>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={onSaveItem}
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
                        </td> */}
                      </>
                    );

                  case "display":
                    return (
                      <>
                        <td>{ingredient.item_name}</td>
                        <td>{ingredient.quantity}</td>
                        <td>{ingredient.unit_name}</td>
                      </>
                    );
                  default:
                    return (
                      <>
                        <td>{ingredient.item_name}</td>
                        <td>{ingredient.quantity}</td>
                        <td>{ingredient.unit_name}</td>
                      </>
                    );
                }
              })()}
            </tr>
          ))}
        </tbody>
      </table>

      {mode === "edit" && (
        <div className="mt-3">
          <button className="btn btn-primary me-2" onClick={handleSave}>
            Save
          </button>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default IngredientTable;
