import { API_ROUTES } from "../config/apiConfig";

export interface Ingredient {
  item_id: number;
  item_name: string;
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
      ...ingredient,
      item_id: ingredient.ingredientItem.item_id,
      item_name: ingredient.ingredientItem.item_name,
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
      item_id: ingredient.item_id,
      item_name: ingredient.item_name,
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

    console.log("Ingredients used in:", data);

    return data.map((ingredient: any) => ({
      item_id: ingredient.itemToCreate.item_id,
      item_name: ingredient.itemToCreate.item_name,
      quantity: ingredient.quantity,
      unit_name: ingredient.itemToCreate.unit_name,
    }));
  } catch (error) {
    console.error("Error fetching ingredients used in:", error);
    throw error;
  }
};

export const createIngredient = async (
  itemToCreateId: number,
  ingredientItemId: number,
  quantity: number
) => {
  const response = await fetch(`${API_ROUTES.INGREDIENTS}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemToCreateId,
      ingredientItemId,
      quantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to create ingredient");
  }

  const data = await response.json();
  return data;
};

export const updateIngredient = async (
  itemToCreateId: number,
  ingredientItemId: number,
  quantity: number
) => {
  const response = await fetch(`${API_ROUTES.INGREDIENTS}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      itemToCreateId,
      ingredientItemId,
      quantity,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to update ingredient");
  }

  const data = await response.json();
  return data;
};

export const deleteIngredient = async (
  itemToCreateId: number,
  ingredientItemId: number
) => {
  const response = await fetch(`${API_ROUTES.INGREDIENTS}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemToCreateId, ingredientItemId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to delete ingredient");
  }

  return await response.json();
};
