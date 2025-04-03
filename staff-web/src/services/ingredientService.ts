import { API_ROUTES } from "../config/apiConfig";

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
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
      name: ingredient.ingredientItem.item_name,
      quantity: ingredient.quantity,
      unit: ingredient.ingredientItem.unit_name,
    }));
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    throw error;
  }
};
