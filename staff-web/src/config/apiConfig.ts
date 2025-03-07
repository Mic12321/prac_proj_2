const API_IP = import.meta.env.VITE_SOME_KEY || "http://localhost:3000";
const API_BASE = `${API_IP}/api`;

export const API_ROUTES = {
  USERS: `${API_BASE}/users`,
  ORDERS: `${API_BASE}/orders`,
  ITEMS: `${API_BASE}/items`,
  CATEGORY: `${API_BASE}/category`,
};
