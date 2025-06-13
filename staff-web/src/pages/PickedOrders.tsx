import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  StaffOrderDetailData,
  getPickedOrders,
} from "../services/orderService";
import OrderSummaryTable from "../components/OrderSummaryTable";

interface PickedOrdersProps {
  staffId: number;
}

const PickedOrders: React.FC<PickedOrdersProps> = ({ staffId }) => {
  const [orders, setOrders] = useState<StaffOrderDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPickedOrders = async () => {
      try {
        const data = await getPickedOrders(staffId);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch picked orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchPickedOrders();
  }, [staffId]);

  if (loading) return <p>Loading your picked orders...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (orders.length === 0) return <p>You have not picked any orders yet.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">My Picked Orders</h2>

      {orders.map((order) => {
        const activeProcessing = order.OrderProcessings?.find(
          (processing) => processing.status === "picked"
        );

        return (
          <div key={order.order_id} className="mb-4 p-3 border rounded">
            <h5>Order #{order.order_id}</h5>
            {activeProcessing ? (
              <>
                <p>Picked by: {activeProcessing.Staff?.username}</p>
                <p>
                  Picked at:{" "}
                  {new Date(activeProcessing.picked_at).toLocaleString()}
                </p>
              </>
            ) : (
              <p>Order not yet picked.</p>
            )}
            <OrderSummaryTable items={order.OrderItems} />
          </div>
        );
      })}

      {/* <Link to="/pending-orders" className="btn btn-secondary mt-3">
        Back to Pending Orders
      </Link> */}
    </div>
  );
};

export default PickedOrders;
