import React, { useEffect, useState } from "react";
import OrderItemDisplay from "../components/OrderItemDisplay";
import { getItemsForSale, Item } from "../services/itemService";
import ShoppingCartPanel from "../components/ShoppingCartPanel";
import NavigateButton from "../components/NavigateButton";
import {
  updateCartItem,
  removeCartItem,
  getShoppingCart,
  addCartItem,
} from "../services/shoppingCartService";

const Order: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //
  const userId = 1;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [itemsData, cartData] = await Promise.all([
        getItemsForSale(),
        getShoppingCart(userId),
      ]);

      setItems(itemsData);
      setCart(
        cartData.reduce(
          (acc, item) => ({ ...acc, [item.item_id]: Number(item.quantity) }),
          {} as { [key: number]: number }
        )
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (itemId: number) => {
    try {
      const newQuantity = Number(cart[itemId] || 0) + 1;

      if (cart[itemId]) {
        await updateCartItem(userId, itemId, newQuantity);
      } else {
        await addCartItem(userId, itemId, 1);
      }

      setCart((prev) => ({ ...prev, [itemId]: newQuantity }));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (itemId: number, removeAll: boolean = false) => {
    try {
      const currentQuantity = cart[itemId] || 0;

      if (removeAll || currentQuantity <= 1) {
        await removeCartItem(userId, itemId);
        setCart((prev) => {
          const updatedCart = { ...prev };
          delete updatedCart[itemId];
          return updatedCart;
        });
      } else {
        const newQuantity = currentQuantity - 1;
        await updateCartItem(userId, itemId, newQuantity);
        setCart((prev) => ({ ...prev, [itemId]: newQuantity }));
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="container mt-4">
        <NavigateButton
          navUrl="/home"
          displayName="<- Back to dashboard page"
        />
      </div>
      <div className="container d-flex flex-column align-items-center justify-content-center">
        <h2 className="mb-4 text-center">Orders</h2>
        <div className="flex-grow-1 p-4">
          {loading ? (
            <p>Loading items...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : (
            <div className="row g-3 w-100 text-center">
              {items.map((item) => (
                <OrderItemDisplay
                  key={item.item_id}
                  item={item}
                  quantity={cart[item.item_id!] || 0}
                  onAdd={() => handleAdd(item.item_id!)}
                  onRemove={() => handleRemove(item.item_id!)}
                />
              ))}
            </div>
          )}
        </div>
        <ShoppingCartPanel
          cart={cart}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      </div>
    </div>
  );
};

export default Order;
