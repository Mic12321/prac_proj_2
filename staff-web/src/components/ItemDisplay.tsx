import React from "react";
import { Item } from "../services/itemService";
import tempImg from "../assets/temp_picture.png";

interface ItemDisplayProps {
  item: Item;
}

const ItemDisplay: React.FC<ItemDisplayProps> = ({ item }) => {
  return (
    <div className="col-6 col-md-3">
      <button
        className="btn btn-light w-100 shadow p-3"
        onClick={() => console.log(`Selected item: ${item.item_name}`)}
      >
        <img
          src={item.picture ? URL.createObjectURL(item.picture) : tempImg}
          alt={item.item_name}
          className="img-fluid rounded"
        />
        <p className="mt-2 fw-bold">{item.item_name}</p>
        <p className="text-muted">${Number(item.price).toFixed(2)}</p>
      </button>
    </div>
  );
};

export default ItemDisplay;
