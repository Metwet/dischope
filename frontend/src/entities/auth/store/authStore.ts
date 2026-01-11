import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

/**
 * Zustand store для управления состоянием авторизации
 * persist - middleware для сохранения состояния в localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      /**
       * Установка данных пользователя и токена после успешной авторизации
       */
      setAuth: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },

      /**
       * Выход из системы - очистка всех данных
       */
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // ключ в localStorage
    }
  )
);
