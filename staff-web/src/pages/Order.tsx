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
import ItemDetailPopup from "../components/ItemDetailPopUp";
import { useNavigate } from "react-router";
import { getIngredients, Ingredient } from "../services/ingredientService";

const Order: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const navigate = useNavigate();

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

  const handleItemClick = async (item: Item) => {
    setSelectedItem(item);
    setShowPopup(true);

    try {
      const ingredientData = await getIngredients(item.item_id!);
      setIngredients(ingredientData);
    } catch (error) {
      console.error("Failed to fetch ingredients", error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      try {
        await Promise.all(
          Object.keys(cart).map((itemId) =>
            removeCartItem(userId, Number(itemId))
          )
        );
        setCart({});
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
                  item={item}
                  quantity={cart[item.item_id!] || 0}
                  onAdd={() => handleAdd(item.item_id!)}
                  onRemove={() => handleRemove(item.item_id!)}
                  onClick={() => handleItemClick(item)}
                />
              ))}
            </div>
          )}
        </div>
        <ShoppingCartPanel
          cart={cart}
          items={items}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onCheckout={handleCheckout}
          onClearCart={handleClearCart}
        />
      </div>

      {showPopup && selectedItem && (
        <ItemDetailPopup
          quantity={cart[selectedItem.item_id!] || 0}
          item={selectedItem}
          ingredients={ingredients}
          onClose={closePopup}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      )}
    </div>
  );
};

export default Order;
