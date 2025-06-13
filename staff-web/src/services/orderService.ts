import { API_ROUTES } from "../config/apiConfig";

type CartValidationItem = {
  item_id: number;
  quantity: number;
  price: number;
};

export interface OrderItem {
  item_id: number;
  quantity: number;
  price_at_purchase: number;
  Item?: {
    item_name: string;
  };
}

export interface Order {
  order_id: number;
  ordertime: string;
  price: number;
  status: string;
}

export interface PaymentData {
  payment_id: number;
  order_id: number;
  payment_method: string;
  amount_paid: number;
  payment_status: string;
  paid_at: string;
}

export interface OrderDetailData extends Order {
  OrderItems: OrderItem[];
  Payments?: PaymentData[];
}

export interface StaffOrderDetailData extends OrderDetailData {
  user_id: number;
  staff_id?: number;
  OrderProcessings: {
    staff_id: number;
    picked_at: string;
    status: string;
    Staff?: {
      user_id: number;
      username: string;
    };
  }[];
}

export const placeOrder = async (
  userId: number,
  paymentMethod: "card" | "cash",
  cartValidationData: CartValidationItem[]
): Promise<{ orderId: number }> => {
  const response = await fetch(API_ROUTES.ORDERS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, paymentMethod, cartValidationData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to place order");
  }

  return data;
};

export const getUserOrders = async (
  userId: number
): Promise<OrderDetailData[]> => {
  const res = await fetch(`${API_ROUTES.ORDERS}/user/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch user orders");
  return res.json();
};

export const getPendingOrders = async () => {
  const res = await fetch(`${API_ROUTES.ORDERS}/pending`);
  if (!res.ok) throw new Error("Failed to fetch pending orders");
  return res.json();
};

export const getAllOrders = async () => {
  const res = await fetch(API_ROUTES.ORDERS);
  if (!res.ok) throw new Error("Failed to fetch all orders");
  return res.json();
};

export const getOrderDetail = async (orderId: number) => {
  const response = await fetch(`${API_ROUTES.ORDERS}/${orderId}`);
  if (!response.ok) throw new Error("Failed to fetch order detail");
  return response.json();
};

export const pickOrder = async (orderId: number, staffId: number) => {
  const res = await fetch(`${API_ROUTES.ORDERS}/${orderId}/pick`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ staff_id: staffId, status: "pending" }),
  });
  if (!res.ok) throw new Error("Failed to pick order");
  return res.json();
};

export const getPickedOrders = async (
  staffId: number
): Promise<StaffOrderDetailData[]> => {
  const res = await fetch(`${API_ROUTES.ORDERS}/staff/${staffId}/orders`);
  if (!res.ok) throw new Error("Failed to fetch picked orders");
  return res.json();
};
