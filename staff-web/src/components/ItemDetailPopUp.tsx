import React from "react";
import { Plus, Minus, X, Trash } from "lucide-react";
import { Item } from "../services/itemService";
import { Ingredient } from "../services/ingredientService";

interface ItemDetailPopupProps {
  item: Item;
  quantity: number;
  ingredients: Ingredient[];
  onClose: () => void;
  onAdd: (itemId: number) => void;
  onRemove: (itemId: number) => void;
}

const ItemDetailPopup: React.FC<ItemDetailPopupProps> = ({
  item,
  quantity,
  ingredients,
  onClose,
  onAdd,
  onRemove,
}) => {
  const buttonStyle = {
    cursor: "pointer",
  };

  const disabledButtonStyle = {
    cursor: "not-allowed",
    backgroundColor: "#e0e0e0",
    borderColor: "#ccc",
    color: "#aaa",
    opacity: 0.6,
  };

  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-opacity-50 bg-dark"
      style={{ zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded shadow-lg w-75">
        <div className="d-flex justify-content-between align-items-center">
          <h4>{item.item_name}</h4>
          <button className="btn btn-sm btn-outline-danger" onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="mt-3 text-muted">Description: {item.item_description}</p>

        <span className="text-muted">Price: ${item.price}</span>

        <h5 className="text-center mt-4">Ingredients</h5>
        <ul className="list-group text-center">
          {ingredients.length > 0 ? (
            ingredients.map((ing, index) => (
              <li key={index} className="list-group-item">
                {ing.quantity} {ing.unit} of {ing.name}
              </li>
            ))
          ) : (
            <li className="list-group-item">No ingredients listed.</li>
          )}
        </ul>

        <div className="d-flex justify-content-center align-items-center mt-3">
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => onRemove(item.item_id!)}
            disabled={quantity === 0}
            style={quantity === 0 ? disabledButtonStyle : buttonStyle}
          >
            <Minus />
          </button>

          <span className="d-flex align-items-center justify-content-center px-2">
            {quantity}
          </span>

          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => onAdd(item.item_id!)}
          >
            <Plus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailPopup;
