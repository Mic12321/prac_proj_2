import React, { useState } from "react";
import { Ingredient } from "../services/ingredientService";

interface IngredientListProps {
  ingredients: Ingredient[];
}

const IngredientList: React.FC<IngredientListProps> = ({ ingredients }) => {
  return (
    <div>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {ingredients.map((ingredient, index) => (
            <tr key={index}>
              <td>{ingredient.name}</td>
              <td>{ingredient.quantity}</td>
              <td>{ingredient.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientList;
