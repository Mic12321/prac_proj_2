import { API_ROUTES } from "../config/apiConfig";

export interface Item {
  item_id?: number;
  item_name: string;
  item_description?: string;
  stock_quantity: number;
  unit_name?: string;
  low_stock_quantity?: number;
  price: number;
  category_id: number;
  for_sale: boolean;
  picture?: File | null;
  category_name?: string;
}

export const addItem = async (item: Omit<Item, "item_id">): Promise<Item> => {
  const response = await fetch(API_ROUTES.ITEMS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(item),
  });

  const createdItem: Item = await response.json();
  return createdItem;
};

export const updateItem = async (id: number, itemData: Item): Promise<Item> => {
  const response = await fetch(`${API_ROUTES.ITEMS}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemData),
  });

  if (!response.ok) {
    throw new Error("Error updating item");
  }

  return await response.json();
};

export const getAllItems = async (): Promise<Item[]> => {
  const response = await fetch(API_ROUTES.ITEMS);

  if (!response.ok) {
    const text = await response.text();
    console.error("Error fetching items:", text);
    throw new Error("Error fetching items: " + text);
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to parse JSON:", error);
    throw new Error("Failed to parse JSON from the server.");
  }
};

export const getItemById = async (id: number): Promise<Item> => {
  const response = await fetch(`${API_ROUTES.ITEMS}/${id}`);
  if (!response.ok) {
    throw new Error("Error fetching item");
  }
  return await response.json();
};

export const deleteItem = async (id: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_ROUTES.ITEMS}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error deleting item");
  }

  return await response.json();
};
