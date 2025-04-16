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
    const errorData = await response.json();
    throw new Error(errorData.error || "Error updating item");
  }

  return await response.json();
};

export const getItemsForSale = async (): Promise<Item[]> => {
  const response = await fetch(`${API_ROUTES.ITEMS}/for-sale`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error fetching items for sale");
  }
  return await response.json();
};

export const getAllItems = async (): Promise<Item[]> => {
  const response = await fetch(API_ROUTES.ITEMS);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error fetching items");
  }

  try {
    const data = await response.json();
    return data;
  } catch (errorData: any) {
    throw new Error(errorData.error || "Failed to parse JSON from the server.");
  }
};

export const getItemById = async (id: number): Promise<Item> => {
  const response = await fetch(`${API_ROUTES.ITEMS}/${id}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error fetching items");
  }
  return await response.json();
};

export const deleteItem = async (id: number): Promise<{ message: string }> => {
  const response = await fetch(`${API_ROUTES.ITEMS}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Error deleting item");
  }

  return await response.json();
};
