import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  StaffOrderDetailData,
  getPickedOrders,
  completeOrder,
  cancelOrder,
} from "../services/orderService";
import OrderSummaryTable from "../components/OrderSummaryTable";
import { useAuth } from "../context/AuthContext";

const PickedOrders: React.FC = () => {
  const { user } = useAuth();
  const staffId = user?.user_id;
  const [orders, setOrders] = useState<StaffOrderDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!staffId) return; // Guard

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

  const handleCompleteOrder = async (orderId: number) => {
    if (!staffId) return; // Guard

    try {
      await completeOrder(orderId, staffId);
      const updatedOrders = await getPickedOrders(staffId);
      setOrders(updatedOrders);
    } catch (err: any) {
      alert(err.message || "Failed to complete order");
    }
  };

  const handleStopPickingOrder = async (orderId: number) => {
    if (!staffId) return; // Guard
    try {
      await cancelOrder(orderId, staffId);
      const updatedOrders = await getPickedOrders(staffId);
      setOrders(updatedOrders);
    } catch (err: any) {
      alert(err.message || "Failed to cancel order");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">My Picked Orders</h2>

      {loading && <p>Loading your picked orders...</p>}

      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p>You have not picked any active orders yet.</p>
      )}

      {!loading &&
        !error &&
        orders.length > 0 &&
        orders.map((order) => {
          const activeProcessing = order.OrderProcessings?.find(
            (processing) =>
              processing.status === "picked" ||
              processing.status === "processing"
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
              <div className="d-flex gap-4">
                <button
                  className="btn btn-success"
                  onClick={() => handleCompleteOrder(order.order_id)}
                >
                  Complete
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleStopPickingOrder(order.order_id)}
                >
                  Stop Picking
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default PickedOrders;
