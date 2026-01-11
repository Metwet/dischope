"use client";

import { Brightness4, Brightness7, Logout } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/entities/auth/store/authStore";
import styles from "./header.module.css";

interface IHeaderProps {
  theme: TTheme;
  toggleTheme: () => void;
}

const Header: FC<IHeaderProps> = ({ theme, toggleTheme }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Не показываем header на странице логина
  if (pathname === "/login") {
    return null;
  }

  return (
    <Box className={styles.header}>
      <Typography variant="h3">dischope</Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {isAuthenticated && user && (
          <Typography variant="body1">{user.name}</Typography>
        )}

        <Tooltip
          title={
            theme === "light" ? "Включить темную тему" : "Включить светлую тему"
          }
        >
          <IconButton onClick={toggleTheme} color="inherit">
            {theme === "light" ? <Brightness4 /> : <Brightness7 />}
          </IconButton>
        </Tooltip>

        {isAuthenticated && (
          <Tooltip title="Выйти">
            <IconButton onClick={handleLogout} color="inherit">
              <Logout />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default Header;
