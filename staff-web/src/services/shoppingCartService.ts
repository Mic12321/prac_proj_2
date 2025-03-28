import { API_ROUTES } from "../config/apiConfig";

export interface ShoppingCartItem {
  item_id: number;
  item_name: string;
  quantity: number;
}

/**
 * Fetch all shopping cart items for a user
 */
export const getShoppingCart = async (
  userId: number
): Promise<ShoppingCartItem[]> => {
  const response = await fetch(`${API_ROUTES.SHOPPING_CART_ITEMS}/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch cart items");
  return response.json();
};

/**
 * Add an item to the cart (or increase quantity if it already exists)
 */
export const addCartItem = async (
  user_id: number,
  item_id: number,
  quantity: number
) => {
  const response = await fetch(`${API_ROUTES.SHOPPING_CART_ITEMS}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id, item_id, quantity }),
  });
  if (!response.ok) throw new Error("Failed to add item to cart");
};

/**
 * Update the quantity of an existing cart item
 */
export const updateCartItem = async (
  user_id: number,
  item_id: number,
  quantity: number
) => {
  const response = await fetch(
    `${API_ROUTES.SHOPPING_CART_ITEMS}/${user_id}/${item_id}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity }),
    }
  );
  if (!response.ok) throw new Error("Failed to update item quantity");
};

/**
 * Remove an item from the cart
 */
export const removeCartItem = async (user_id: number, item_id: number) => {
  const response = await fetch(
    `${API_ROUTES.SHOPPING_CART_ITEMS}/${user_id}/${item_id}`,
    {
      method: "DELETE",
    }
  );
  if (!response.ok) throw new Error("Failed to remove item from cart");
};

/**
 * Clear all items in the cart
 */
export const clearCart = async (user_id: number) => {
  const response = await fetch(`${API_ROUTES.SHOPPING_CART_ITEMS}/${user_id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to clear shopping cart");
};
