import { API_ROUTES } from "../config/apiConfig";

type CartValidationItem = {
  item_id: number;
  quantity: number;
  price: number;
};

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
