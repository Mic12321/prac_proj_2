import React from "react";
import tempImg from "../assets/temp_picture.png";
import { OrderItem } from "../services/orderService";

interface OrderItemsListProps {
  items: OrderItem[];
  placeholderImage?: string;
}

const OrderItemsList: React.FC<OrderItemsListProps> = ({
  items,
  placeholderImage = tempImg,
}) => {
  return (
    <>
      {items.map((item) => {
        const itemName = item.Item?.item_name || "Unnamed Item";
        const price = Number(item.price_at_purchase);
        const quantity = item.quantity;
        const subtotal = price * quantity;

        return (
          <div
            key={item.item_id}
            className="row align-items-center mb-3 border-bottom pb-2"
          >
            <div className="col-auto">
              <img
                src={placeholderImage}
                alt={itemName}
                className="rounded"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
            </div>
            <div className="col">
              <div className="fw-bold">{itemName}</div>
            </div>
            <div className="col text-end">${price.toFixed(2)}</div>
            <div className="col text-end">{quantity}</div>
            <div className="col text-end fw-semibold">
              ${subtotal.toFixed(2)}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OrderItemsList;
