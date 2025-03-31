import React from "react";
import { Plus, Minus } from "lucide-react";
import { Item } from "../services/itemService";

interface ItemDetailPopupProps {
  item: Item;
  onClose: () => void;
  onAdd: (itemId: number) => void;
  onRemove: (itemId: number) => void;
}

const ItemDetailPopup: React.FC<ItemDetailPopupProps> = ({
  item,
  onClose,
  onAdd,
  onRemove,
}) => {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-opacity-50 bg-dark"
      style={{ zIndex: 1050 }}
    >
      <div className="bg-white p-4 rounded shadow-lg w-75">
        <div className="d-flex justify-content-between align-items-center">
          <h4>{item.item_name}</h4>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <p className="mt-3">{item.item_description}</p>

        <div className="d-flex align-items-center mt-3">
          <button
            className="btn btn-sm btn-outline-danger me-2"
            onClick={() => onRemove(item.item_id!)}
          >
            <Minus />
          </button>

          <span className="d-flex align-items-center justify-content-center px-2">
            {item.price}
          </span>

          <button
            className="btn btn-sm btn-outline-success ms-2"
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
