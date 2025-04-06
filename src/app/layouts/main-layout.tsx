"use client";

import { darkTheme, lightTheme } from "@/shared/theme/theme";
import Header from "@/widgets/header/header";
import { Container, CssBaseline, ThemeProvider } from "@mui/material";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";

interface IMainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<IMainLayoutProps> = ({ children }) => {
  const [theme, setTheme] = useState<TTheme>("light");
  const [isMounted, setIsMounted] = useState(false);

  const currentTheme = useMemo(
    () => (theme === "light" ? lightTheme : darkTheme),
    [theme]
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
      <Container maxWidth="lg">
        <Header theme={theme} toggleTheme={toggleTheme} />
        {children}
      </Container>
    </ThemeProvider>
  );
};

export default MainLayout;
