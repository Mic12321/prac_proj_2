import React from "react";
import OrderItemsList from "./OrderItemsList";
import { OrderItem } from "../services/orderService";

interface OrderSummaryTableProps {
  items: OrderItem[];
  title?: string;
}

const OrderSummaryTable: React.FC<OrderSummaryTableProps> = ({
  items,
  title = "Order Summary",
}) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <div className="row fw-bold mb-2 border-bottom pb-2">
          <div className="col-auto">Item</div>
          <div className="col">Name</div>
          <div className="col text-end">Price</div>
          <div className="col text-end">Qty</div>
          <div className="col text-end">Total</div>
        </div>
        <OrderItemsList items={items} />
      </div>
    </div>
  );
};

export default OrderSummaryTable;
