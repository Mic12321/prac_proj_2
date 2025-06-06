import { API_ROUTES } from "../config/apiConfig";

export interface Category {
  category_id?: number;
  category_name: string;
  category_description: string;
  linked_item_quantity?: number;
}

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(API_ROUTES.CATEGORY);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch categories");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to get categories: Server is unreachable.");
    }

    throw error;
  }
};

export const getCategoryById = async (
  category_id: number
): Promise<Category | null> => {
  try {
    const response = await fetch(`${API_ROUTES.CATEGORY}/${category_id}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Category not found");
    }
    return await response.json();
  } catch (error: any) {
    console.error("Error fetching category by id:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to get category by id: Server is unreachable.");
    }

    throw error;
  }
};

export const addCategory = async (
  category: Category
): Promise<Category | null> => {
  try {
    const response = await fetch(API_ROUTES.CATEGORY, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(errorData.error);
      throw new Error(errorData.error || "Failed to add category");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error adding category:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to add category: Server is unreachable.");
    }

    throw error;
  }
};

export const updateCategory = async (
  category_id: number,
  category: Category
): Promise<Category> => {
  try {
    const response = await fetch(`${API_ROUTES.CATEGORY}/${category_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error updating items");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error updating category:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to update category: Server is unreachable.");
    }

    throw error;
  }
};

export const deleteCategory = async (category_id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ROUTES.CATEGORY}/${category_id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error: any) {
    console.error("Error deleting category:", error);

    if (
      error.message.includes("Failed to fetch") ||
      error.name === "TypeError"
    ) {
      throw new Error("Failed to delete category: Server is unreachable.");
    }

    throw error;
  }
};
