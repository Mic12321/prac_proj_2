import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Item } from "../services/itemService";

const ItemsUsingIngredient: React.FC = () => {
  const { ingredientId } = useParams<{ ingredientId: string }>();

  const [itemsUsingIngredient, setItemsUsingIngredient] = useState<Item[]>([]);

  const handleComplete = (ingredient: Item, quantity: number) => {
    console.log("hi");
  };

  return (
    <div className="container">
      <h2>Manage Items Using Apple</h2>

      {itemsUsingIngredient.length > 0 ? (
        <p>Some items are using this ingredient.</p>
      ) : (
        <p>No items are using this ingredient.</p>
      )}
    </div>
  );
};

export default ItemsUsingIngredient;
