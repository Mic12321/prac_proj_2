import React from "react";
import { Item } from "../services/itemService";
import tempImg from "../assets/temp_picture.png";

interface OrderItemDisplayProps {
  item: Item;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  onClick: () => void;
}

const OrderItemDisplay: React.FC<OrderItemDisplayProps> = ({
  item,
  quantity,
  onAdd,
  onRemove,
  onClick,
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
    <div className="col-6 col-md-3">
      <div className="card shadow p-3">
        <img
          src={item.picture ? URL.createObjectURL(item.picture) : tempImg}
          alt={item.item_name}
          className="img-fluid rounded"
          onClick={onClick}
          style={buttonStyle}
        />
        <p className="mt-2 fw-bold">{item.item_name}</p>
        <p className="text-muted">${Number(item.price).toFixed(2)}</p>
        <div className="d-flex justify-content-center align-items-center mt-2">
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={onRemove}
            disabled={quantity === 0}
            style={quantity === 0 ? disabledButtonStyle : buttonStyle}
          >
            -
          </button>
          <span className="mx-2">{quantity}</span>
          <button
            className="btn btn-outline-success btn-sm"
            onClick={onAdd}
            style={buttonStyle}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderItemDisplay;
