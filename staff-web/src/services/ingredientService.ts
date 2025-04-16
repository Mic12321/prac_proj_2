import { API_ROUTES } from "../config/apiConfig";

export interface Ingredient {
  id: number;
  name: string;
  quantity: number;
  unit_name: string;
}

export const getIngredients = async (itemId: number) => {
  try {
    const response = await fetch(`${API_ROUTES.INGREDIENTS}/${itemId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch ingredients");
    }

    const data = await response.json();

    return data.map((ingredient: any) => ({
      id: ingredient.ingredientItem.item_id,
      name: ingredient.ingredientItem.item_name,
      quantity: ingredient.quantity,
      unit_name: ingredient.ingredientItem.unit_name,
    }));
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};

export const getAvailableIngredients = async (itemId: number) => {
  try {
    const response = await fetch(
      `${API_ROUTES.INGREDIENTS}/available/${itemId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || "Failed to fetch available ingredients"
      );
    }

    const data = await response.json();

    return data.map((ingredient: any) => ({
      ...ingredient,
      id: ingredient.item_id,
      name: ingredient.item_name,
      quantity: ingredient.quantity,
      unit_name: ingredient.unit_name,
    }));
  } catch (error) {
    console.error("Error fetching available ingredients:", error);
    throw error;
  }
};

export const getIngredientsUsedIn = async (itemId: number) => {
  try {
    const response = await fetch(`${API_ROUTES.INGREDIENTS}/used-in/${itemId}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch ingredients used in");
    }

    const data = await response.json();

    return data.map((ingredient: any) => ({
      id: ingredient.item_id,
      name: ingredient.itemToCreate.item_name,
      quantity: ingredient.quantity,
      unit_name: ingredient.itemToCreate.unit_name,
    }));
  } catch (error) {
    console.error("Error fetching ingredients used in:", error);
    throw error;
  }
};
