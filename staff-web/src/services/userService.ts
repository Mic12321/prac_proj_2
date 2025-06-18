import { API_ROUTES } from "../config/apiConfig";

export interface UserRegisterData {
  username: string;
  password: string;
  role?: "staff" | "admin" | "client";
}

export interface UserUpdateData {
  username?: string;
  password?: string;
  role?: "staff" | "admin" | "client";
  total_points?: number;
  last_login?: string;
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    throw new Error(error);
  }
  return data;
}

export async function registerUser(userData: UserRegisterData) {
  const response = await fetch(`${API_ROUTES.USERS}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function updateUser(userId: number, updateData: UserUpdateData) {
  const response = await fetch(`${API_ROUTES.USERS}/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  return handleResponse(response);
}

export async function deleteUser(userId: number) {
  const response = await fetch(`${API_ROUTES.USERS}/${userId}`, {
    method: "DELETE",
  });
  return handleResponse(response);
}
