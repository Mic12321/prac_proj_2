import { API_ROUTES } from "../config/apiConfig";

export interface Category {
  category_id?: number;
  category_name: string;
  category_description: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(API_ROUTES.CATEGORY);
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchCategoryById = async (
  category_id: number
): Promise<Category | null> => {
  try {
    const response = await fetch(`${API_ROUTES.CATEGORY}/${category_id}`);
    if (!response.ok) {
      throw new Error("Category not found");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
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
      throw new Error("Failed to add category");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding category:", error);
    return null;
  }
};

export const updateCategory = async (
  category_id: number,
  category: Category
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ROUTES.CATEGORY}/${category_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });

    return response.ok;
  } catch (error) {
    console.error("Error updating category:", error);
    return false;
  }
};

export const deleteCategory = async (category_id: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_ROUTES.CATEGORY}/${category_id}`, {
      method: "DELETE",
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};
