/**
 * @description Корневой layout приложения. Управляет темой (light/dark) и оборачивает контент в AuthGuard.
 */
"use client";

import { darkTheme, lightTheme } from "@/shared/theme/theme";
import { Header } from "@/widgets/header";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import AuthGuard from "../_providers/AuthGuard/AuthGuard";

interface IMainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<TTheme>("light");
  const [isMounted, setIsMounted] = useState(false);

  const currentTheme = useMemo(
    () => (theme === "light" ? lightTheme : darkTheme),
    [theme],
  );

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (!isMounted) return null;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
        <AuthGuard>
          <Container maxWidth="xl">
            <Header theme={theme} toggleTheme={toggleTheme} />
            {children}
          </Container>
        </AuthGuard>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default MainLayout;
