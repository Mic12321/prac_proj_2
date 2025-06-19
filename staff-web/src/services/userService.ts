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

export interface UserData {
  user_id: number;
  username: string;
  account_creation: string;
  last_login: string | null;
  total_points: number;
  role: "staff" | "admin" | "client";
}

async function handleResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) {
    const error = (data && data.error) || response.statusText;
    throw new Error(error);
  }
  return data;
}

export async function registerUser(userData: UserRegisterData, token: string) {
  const response = await fetch(`${API_ROUTES.USERS}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

export async function updateUser(
  userId: number,
  updateData: UserUpdateData,
  token: string
) {
  const response = await fetch(`${API_ROUTES.USERS}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  return handleResponse(response);
}

export async function deleteUser(userId: number, token: string) {
  const response = await fetch(`${API_ROUTES.USERS}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}

export async function fetchUsers(token: string): Promise<UserData[]> {
  const response = await fetch(`${API_ROUTES.USERS}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
}
