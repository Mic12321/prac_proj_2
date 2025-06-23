import React, { useEffect, useState } from "react";
import OrderItemDisplay from "../components/OrderItemDisplay";
import { getItemsForSale, Item } from "../services/itemService";
import { getCategories, Category } from "../services/categoryService";
import { getIngredients, Ingredient } from "../services/ingredientService";
import ShoppingCartPanel from "../components/ShoppingCartPanel";
import NavigateButton from "../components/NavigateButton";
import CategoryButton from "../components/CategoryButton";
import {
  updateCartItem,
  removeCartItem,
  getShoppingCart,
  addCartItem,
} from "../services/shoppingCartService";
import ItemDetailPopup from "../components/ItemDetailPopUp";
import { useNavigate } from "react-router";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAuth } from "../context/AuthContext";

const Order: React.FC = () => {
  const { token, logout, user } = useAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  const [totalItems, setTotalItems] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const navigate = useNavigate();

  const userId = user?.user_id;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!userId) return; // Guard for no user
    if (!token) {
      setError("You must be logged in to view this page.");
      return;
    }
    setLoading(true);
    try {
      const [itemsData, cartResponse, categoryData] = await Promise.all([
        getItemsForSale(token),
        getShoppingCart(userId),
        getCategories(),
      ]);

      setItems(itemsData);
      setCategories(categoryData);

      const cart = cartResponse.items.reduce(
        (acc, item) => ({
          ...acc,
          [item.item_id]: Number(item.quantity),
        }),
        {} as { [key: number]: number }
      );

      setCart(cart);
      setTotalItems(cartResponse.totalItems);
      setSubtotal(cartResponse.subtotal);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    if (!userId) return; // Guard for no user
    const cartResponse = await getShoppingCart(userId);

    const updatedCart = cartResponse.items.reduce(
      (acc, item) => ({
        ...acc,
        [item.item_id]: Number(item.quantity),
      }),
      {} as { [key: number]: number }
    );

    setCart(updatedCart);
    setTotalItems(cartResponse.totalItems);
    setSubtotal(cartResponse.subtotal);
  };

  const handleAdd = async (itemId: number) => {
    if (!userId) return; // Guard for no user
    try {
      const newQuantity = Number(cart[itemId] || 0) + 1;

      if (cart[itemId]) {
        await updateCartItem(userId, itemId, newQuantity);
      } else {
        await addCartItem(userId, itemId, 1);
      }

      await refreshCart();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleRemove = async (itemId: number, removeAll: boolean = false) => {
    if (!userId) return; // Guard for no user
    try {
      const currentQuantity = cart[itemId] || 0;

      if (removeAll || currentQuantity <= 1) {
        await removeCartItem(userId, itemId);
      } else {
        await updateCartItem(userId, itemId, currentQuantity - 1);
      }

      await refreshCart();
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

  const handleClearCancel = () => {
    setShowConfirmDialog(false);
  };

  const handleClearCart = async () => {
    if (!userId) return; // Guard for no user
    try {
      await Promise.all(
        Object.keys(cart).map((itemId) =>
          removeCartItem(userId, Number(itemId))
        )
      );

      await refreshCart();
    } catch (err: any) {
      setError(err.message);
    }
    setShowConfirmDialog(false);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedItem(null);
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const filteredItems = items.filter(
    (item) =>
      selectedCategoryId === null || item.category_id === selectedCategoryId
  );

  const visibleCategories = categories.filter((category) =>
    items.some((item) => item.category_id === category.category_id)
  );

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
        <div className="row mb-4 w-100">
          <CategoryButton
            label="All Items"
            displayName="All Items"
            onClick={() => setSelectedCategoryId(null)}
            selected={selectedCategoryId === null}
          />

          {visibleCategories.map((category) => (
            <CategoryButton
              key={category.category_id}
              label={category.category_name}
              displayName={category.category_name}
              onClick={() => setSelectedCategoryId(category.category_id!)}
              selected={selectedCategoryId === category.category_id}
            />
          ))}
        </div>
        <div className="flex-grow-1 p-4 w-100">
          {loading ? (
            <p>Loading items...</p>
          ) : error ? (
            <p className="text-danger">Error: {error}</p>
          ) : filteredItems.length === 0 ? (
            <p className="text-muted text-center">No items available.</p>
          ) : (
            <div className="row g-3 w-100 text-center">
              {filteredItems.map((item) => (
                <OrderItemDisplay
                  key={item.item_id}
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
          onClearCart={() => setShowConfirmDialog(true)}
          totalItems={totalItems}
          subtotal={subtotal}
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

      <ConfirmationModal
        show={showConfirmDialog}
        onHide={handleClearCancel}
        onConfirm={handleClearCart}
        title="Clear All Items In Cart"
        message="Are you sure you want to clear all items in cart?"
        cancelButtonLabel="No, Cancel"
        confirmButtonLabel="Yes, Clear"
        cancelButtonClass="btn btn-secondary"
        confirmButtonClass="btn btn-danger"
      />
    </div>
  );
};

export default Order;
