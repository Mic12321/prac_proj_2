import { API_ROUTES } from "../config/apiConfig";

interface User {
  user_id: number;
  username: string;
  role: "client" | "staff" | "admin";
}

interface LoginResponse {
  user: User | null;
  token?: string;
  error?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

export async function login({
  username,
  password,
}: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_ROUTES.AUTH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || "Login failed", user: null };
    }

    const data = await response.json();
    console.log("Login successful:", data);

    return data;
  } catch (err) {
    return { error: "Server error, please try again later.", user: null };
  }
}
