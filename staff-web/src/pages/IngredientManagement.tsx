import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getAllItems, getItemById, Item } from "../services/itemService";
import IngredientSelector from "../components/IngredientSelector";
import ToastNotification from "../components/ToastNotification";
import {
  getAvailableIngredients,
  getIngredients,
} from "../services/ingredientService";

const ItemsUsingIngredient: React.FC = () => {
  const { itemId } = useParams<{ itemId: string }>();
  const [item, setItem] = useState<Item>();
  const [ingredients, setIngredients] = useState<Item[]>([]);
  const [availableIngredients, setAvailableIngredients] = useState<Item[]>([]);

  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const handleComplete = (ingredient: Item, quantity: number) => {
    console.log("hi");
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const fetchedItem = await getItemById(Number(itemId));
        setItem(fetchedItem);
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message || "An error occurred while fetching the item."
        );
        setShowToast(true);
      }
    };
    const fetchItemIngredients = async () => {
      try {
        if (itemId) {
          const fetchedItemIngredients = await getIngredients(Number(itemId));
          setIngredients(fetchedItemIngredients || []);
        }
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message ||
            "An error occurred while fetching the item ingredients."
        );
        setShowToast(true);
      }
    };

    const fetchAvailableIngredients = async () => {
      try {
        if (itemId) {
          const fetchAvailableIngredients = await getAvailableIngredients(
            Number(itemId)
          );
          setAvailableIngredients(fetchAvailableIngredients || []);
        }
      } catch (error: any) {
        setToastVariant("danger");
        setToastMessage(
          error.message ||
            "An error occurred while fetching the available item ingredients."
        );
        setShowToast(true);
      }
    };

    if (itemId) {
      fetchItem();
      fetchItemIngredients();
      fetchAvailableIngredients();
    }
  }, [itemId]);

  return (
    <div className="container mt-4">
      <h2>Manage Ingredients of {item?.item_name}</h2>

      {ingredients.length > 0 ? (
        <IngredientSelector
          mode="assign-ingredient"
          currentItem={item!}
          addedItems={ingredients}
          availableItems={availableIngredients}
          onComplete={handleComplete}
        />
      ) : (
        <p>No items are using this ingredient.</p>
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

export default ItemsUsingIngredient;
