"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/entities/auth/store/authStore";
import { Box, CircularProgress } from "@mui/material";

/**
 * AuthGuard - компонент для защиты маршрутов на клиентской стороне
 * Проверяет авторизацию пользователя и перенаправляет на страницу логина если не авторизован
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Если не авторизован и не на странице логина - редирект
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }

    // Если авторизован и на странице логина - редирект на главную
    if (isAuthenticated && pathname === "/login") {
      router.push("/");
    }
  }, [isAuthenticated, pathname, router]);

  // Показываем loader пока проверяем авторизацию
  if (!isAuthenticated && pathname !== "/login") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
