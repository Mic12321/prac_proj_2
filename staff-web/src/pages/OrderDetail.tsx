import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { getOrderDetail, OrderDetailData } from "../services/orderService";
import OrderItemsList from "../components/OrderItemsList";
import ToastNotification from "../components/ToastNotification";

const OrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetailData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");

  useEffect(() => {
    const message = sessionStorage.getItem("successMessage");
    if (message) {
      setToastVariant("success");
      setToastMessage(message);
      setShowToast(true);
      sessionStorage.removeItem("successMessage");
    }
    const fetchOrder = async () => {
      try {
        const data = await getOrderDetail(Number(orderId));
        setOrder(data);
      } catch (err: any) {
        setError(err.message || "Failed to load order");
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!order) return <p>Loading order details...</p>;

  return (
    <div className="container mt-4">
      <h2>Order #{order.order_id}</h2>
      <p>
        <strong>Status:</strong> {order.status}
      </p>
      <p>
        <strong>Placed At:</strong> {new Date(order.ordertime).toLocaleString()}
      </p>

      <h5 className="mt-4">Items:</h5>
      <OrderItemsList items={order.OrderItems} />

      <p>
        <strong>Total:</strong> ${order.price}
      </p>

      {order.Payments && order.Payments.length > 0 && (
        <>
          <h5>Payments</h5>
          {order.Payments.map((payment) => (
            <div key={payment.payment_id}>
              <p>
                <strong>Method:</strong> {payment.payment_method}
              </p>
              <p>
                <strong>Status:</strong> {payment.payment_status}
              </p>
              <p>
                <strong>Paid At:</strong>{" "}
                {new Date(payment.paid_at).toLocaleString()}
              </p>
              <hr />
            </div>
          ))}
        </>
      )}

      <Link to="/order-history" className="btn btn-secondary mt-3">
        Back to Order History
      </Link>
      <ToastNotification
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        variant={toastVariant}
        delay={5000}
      />
    </div>
  );
};

export default OrderDetail;
