import React, { useEffect, useState } from "react";
import { getUserOrders, OrderDetailData } from "../services/orderService";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.user_id;
  const [orders, setOrders] = useState<OrderDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return; // Guard for no user

    const fetchOrders = async () => {
      try {
        const data = await getUserOrders(userId);
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (orders.length === 0) return <p>You haven’t placed any orders yet.</p>;

  return (
    <div className="container mt-4">
      <h2>My Order History</h2>
      <div className="list-group">
        {orders.map((order) => (
          <div
            key={order.order_id}
            className="list-group-item mb-3 border rounded p-3"
          >
            <h5 className="mb-2">Order #{order.order_id}</h5>
            <p className="mb-1">
              Status: <strong>{order.status}</strong>
            </p>
            <p className="mb-1">
              Total Paid: <strong>${order.price}</strong>
            </p>
            <p className="mb-2 text-muted">
              Placed on: {new Date(order.ordertime).toLocaleString()}
            </p>

            {order.OrderItems?.length ? (
              <ul className="mb-2">
                {order.OrderItems.map((item) => (
                  <li key={item.item_id}>
                    {item.Item?.item_name || "Unnamed Item"} × {item.quantity} @
                    ${item.price_at_purchase}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted mb-2">No items found in this order.</p>
            )}

            <button
              className="btn btn-primary"
              onClick={() => navigate(`/order-detail/${order.order_id}`)}
            >
              View Order Detail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
