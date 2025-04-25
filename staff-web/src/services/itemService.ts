import { API_ROUTES } from "../config/apiConfig";

export interface Item {
  item_id?: number;
  item_name: string;
  item_description: string;
  stock_quantity: number;
  unit_name: string;
  low_stock_quantity: number;
  price: number;
  category_id: number;
  for_sale: boolean;
  picture: File | string | null;
  category_name?: string;
}

export const addItem = async (item: Omit<Item, "item_id">): Promise<Item> => {
  try {
    const response = await fetch(API_ROUTES.ITEMS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to add item");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error adding item:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to add item: Server is unreachable.");
    }

    throw error;
  }
};

export const updateItem = async (id: number, itemData: Item): Promise<Item> => {
  try {
    const response = await fetch(`${API_ROUTES.ITEMS}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(itemData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating item");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error updating item:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to update item: Server is unreachable.");
    }

    throw error;
  }
};

export const getItemsForSale = async (): Promise<Item[]> => {
  try {
    const response = await fetch(`${API_ROUTES.ITEMS}/for-sale`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching items for sale");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error getting items for sale:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to get items for sale: Server is unreachable.");
    }

    throw error;
  }
};

export const getAllItems = async (): Promise<Item[]> => {
  try {
    const response = await fetch(API_ROUTES.ITEMS);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching all items");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error getting all items:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to get all items: Server is unreachable.");
    }
    throw error;
  }
};

export const getItemById = async (id: number): Promise<Item> => {
  try {
    const response = await fetch(`${API_ROUTES.ITEMS}/${id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching items");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error getting item by id:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to get item by id: Server is unreachable.");
    }
    throw error;
  }
};

export const deleteItem = async (id: number): Promise<{ message: string }> => {
  try {
    const response = await fetch(`${API_ROUTES.ITEMS}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error deleting item");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error deleting item:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to delete item: Server is unreachable.");
    }
    throw error;
  }
};

export const getItemsByCategoryId = async (
  categoryId: number
): Promise<Item[]> => {
  try {
    const response = await fetch(
      `${API_ROUTES.ITEMS}/by-category/${categoryId}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error fetching items by category");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error getting items by category id:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error(
        "Failed to get items by category id: Server is unreachable."
      );
    }
    throw error;
  }
};
