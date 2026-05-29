import { create } from "zustand";

interface User {
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  login: (token: string, email: string) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("adm_token");
  }
  return null;
};

const getInitialUser = (): User | null => {
  if (typeof window !== "undefined") {
    const email = localStorage.getItem("adm_user_email");
    return email ? { email } : null;
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: getInitialToken(),
  user: getInitialUser(),
  isAuthenticated: !!getInitialToken(),
  isLoginModalOpen: false,
  login: (token: string, email: string) => {
    localStorage.setItem("adm_token", token);
    localStorage.setItem("adm_user_email", email);
    set({ token, user: { email }, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("adm_token");
    localStorage.removeItem("adm_user_email");
    set({ token: null, user: null, isAuthenticated: false });
  },
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));
