import React, { useEffect, useState } from "react";
import {
  getPendingOrders,
  pickOrder,
  StaffOrderDetailData,
} from "../services/orderService";
import OrderSummaryTable from "../components/OrderSummaryTable";
import ConfirmationModal from "../components/ConfirmationModal";
import { useNavigate } from "react-router";

const PendingOrders: React.FC = () => {
  const [orders, setOrders] = useState<StaffOrderDetailData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [pickedOrderId, setPickedOrderId] = useState<number | null>(null);

  const navigate = useNavigate();

  //
  const staffId = 1;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getPendingOrders();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handlePickOrder = async (orderId: number, staffId: number) => {
    try {
      await pickOrder(orderId, staffId);
      console.log(`Order ${orderId} picked by staff ${staffId}`);

      // Remove picked order from state
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.order_id !== orderId)
      );

      setPickedOrderId(orderId);
      setShowModal(true);
    } catch (error: any) {
      console.error("Error picking order:", error);
      setError(error.message || "Failed to pick order");
    }
  };

  const handleModalConfirm = () => {
    navigate("/staff/orders");
  };

  const handleModalCancel = () => {
    setShowModal(false);
  };

  if (loading) return <p>Loading paid orders...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;
  if (orders.length === 0) return <p>No paid orders found.</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Pending Orders</h2>
      {orders.map((order) => (
        <div key={order.order_id} className="mb-5 border rounded p-3">
          <h5 className="mb-2">Order #{order.order_id}</h5>
          <p>
            <strong>User ID:</strong> {order.user_id}
          </p>
          <p>
            <strong>Ordered at:</strong>{" "}
            {new Date(order.ordertime).toLocaleString()}
          </p>
          <OrderSummaryTable items={order.OrderItems} />
          <button
            className="btn btn-primary"
            onClick={() => handlePickOrder(order.order_id, staffId)}
          >
            Pick Up
          </button>
        </div>
      ))}
      <ConfirmationModal
        show={showModal}
        onHide={handleModalCancel}
        onConfirm={handleModalConfirm}
        title="Order Picked!"
        message="Do you want to continue picking more orders or view your picked orders?"
        cancelButtonLabel="Continue Picking"
        confirmButtonLabel="Go to Picked Orders"
        cancelButtonClass="btn btn-secondary"
        confirmButtonClass="btn btn-primary"
      />
    </div>
  );
};

export default PendingOrders;
