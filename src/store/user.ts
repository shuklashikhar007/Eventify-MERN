import { create } from "zustand";

const API_BASE = import.meta.env.VITE_BACKEND_URL ?? "http://localhost:3000";

const AUTH_ENDPOINT = `${API_BASE}/auth/user`;
const LOGIN_ENDPOINT = `${API_BASE}/auth/login`;
const SIGNUP_ENDPOINT = `${API_BASE}/auth/signup`;
const LOGOUT_ENDPOINT = `${API_BASE}/auth/user/logout`;

export interface User {
  ID: string;
  name: string;
  email: string;
  image_url?: string | null;
  CreatedAt: Date;
  UpdatedAt: Date;
}

interface UserStore {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  refresh: () => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,

  // Returns null on success, or an error message string on failure
  login: async (email, password) => {
    try {
      const res = await fetch(LOGIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.message ?? "Login failed.";

      localStorage.setItem("token", data.token);
      set({ user: data.user });
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  },

  // Returns null on success, or an error message string on failure
  signup: async (name, email, password) => {
    try {
      const res = await fetch(SIGNUP_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) return data.message ?? "Signup failed.";

      localStorage.setItem("token", data.token);
      set({ user: data.user });
      return null;
    } catch {
      return "Network error. Please try again.";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null });
    // Optionally notify the server (fire-and-forget)
    fetch(LOGOUT_ENDPOINT).catch(() => {});
  },

  refresh: async () => {
    const token = localStorage.getItem("token");
    try {
      if (!token) throw new Error("no token");
      set({ isLoading: true });

      const res = await fetch(AUTH_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok || !data.user) throw new Error("invalid token");
      set({ user: data.user });
    } catch {
      localStorage.removeItem("token"); // clear bad/expired token
      set({ user: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
