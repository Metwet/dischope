const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

const checkResponse = async <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  } else {
    return res.json().then((err) => Promise.reject(err));
  }
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Логин пользователя
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  return fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<AuthResponse>(res));
};

/**
 * Регистрация нового пользователя
 */
export const register = async (data: RegisterRequest): Promise<User> => {
  return fetch(`${API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<User>(res));
};

/**
 * Получение информации о текущем пользователе
 */
export const getCurrentUser = async (token: string): Promise<User> => {
  return fetch(`${API_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkResponse<User>(res));
};
