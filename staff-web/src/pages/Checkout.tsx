import React, { useEffect, useState } from "react";
import { CreditCard, DollarSign } from "lucide-react";
import {
  getShoppingCart,
  ShoppingCartItem,
} from "../services/shoppingCartService";
import { OrderItem, placeOrder } from "../services/orderService";
// import tempImg from "../assets/temp_picture.png";
import { useNavigate } from "react-router";
import ToastNotification from "../components/ToastNotification";
import OrderItemsList from "../components/OrderItemsList";
import OrderSummaryTable from "../components/OrderSummaryTable";

const Checkout: React.FC = () => {
  const userId = 1;
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<
    "success" | "danger" | "info"
  >("success");

  const navigate = useNavigate();

  const mappedItems: OrderItem[] = cartItems.map((item) => ({
    item_id: item.item_id,
    quantity: item.quantity,
    price_at_purchase: item.price,
    Item: {
      item_name: item.item_name,
    },
    subtotal: (item.price * item.quantity).toFixed(2),
  }));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cartResponse = await getShoppingCart(userId);
        setCartItems(cartResponse.items);
        setSubtotal(Number(cartResponse.subtotal));
        setTotalItems(cartResponse.totalItems);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const buildCartValidationData = () => {
    return cartItems.map((item) => ({
      item_id: item.item_id,
      quantity: item.quantity,
      price: item.price,
    }));
  };

  const handleCheckout = async (paymentMethod: "card" | "cash") => {
    if (isProcessing || isPaid) return;

    setIsProcessing(true);
    try {
      const order = await placeOrder(
        userId,
        paymentMethod,
        buildCartValidationData()
      );
      setIsPaid(true);
      setToastMessage("Checkout successfully!");
      setToastVariant("success");
      setShowToast(true);

      sessionStorage.setItem("successMessage", "Checkout successfully!");
      navigate(`/order-detail/${order.orderId}`);
    } catch (err: any) {
      console.error("Checkout error:", err);
      setToastVariant("danger");
      setToastMessage(err.message || "Checkout failed");
      setShowToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Checkout</h2>

      {loading ? (
        <p>Loading cart...</p>
      ) : error ? (
        <p className="text-danger">Error: {error}</p>
      ) : (
        <>
          <OrderSummaryTable items={mappedItems} />

          <div className="d-flex justify-content-between mb-3">
            <button
              className="btn btn-lg btn-success"
              onClick={() => handleCheckout("card")}
              disabled={isProcessing || isPaid}
            >
              <CreditCard className="me-3" /> Pay by Card
            </button>

            <button
              className="btn btn-lg btn-success"
              onClick={() => handleCheckout("cash")}
              disabled={isProcessing || isPaid}
            >
              <DollarSign className="me-3" /> Pay by Cash
            </button>
          </div>

          {paymentSuccess && (
            <div className="alert alert-success mt-3">
              Payment successful via <strong>{paymentMethod}</strong>!
            </div>
          )}
        </>
      )}
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

export default Checkout;
