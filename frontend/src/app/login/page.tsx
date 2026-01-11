"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Tab,
  Tabs,
} from "@mui/material";
import { login, register } from "@/shared/api/auth-api";
import { useAuthStore } from "@/entities/auth/store/authStore";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const [tabValue, setTabValue] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Состояние для логина
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Состояние для регистрации
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(loginData);
      setAuth(response.user, response.access_token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Сначала регистрируем пользователя
      await register(registerData);

      // Затем логинимся
      const response = await login({
        email: registerData.email,
        password: registerData.password,
      });

      setAuth(response.user, response.access_token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Dischope
          </Typography>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            centered
            sx={{ mb: 2 }}
          >
            <Tab label="Вход" />
            <Tab label="Регистрация" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Форма входа */}
          <TabPanel value={tabValue} index={0}>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                margin="normal"
                required
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                margin="normal"
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Вход..." : "Войти"}
              </Button>
            </form>
          </TabPanel>

          {/* Форма регистрации */}
          <TabPanel value={tabValue} index={1}>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Имя"
                type="text"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                margin="normal"
                required
                autoComplete="name"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                margin="normal"
                required
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    password: e.target.value,
                  })
                }
                margin="normal"
                required
                autoComplete="new-password"
                helperText="Минимум 6 символов"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Регистрация..." : "Зарегистрироваться"}
              </Button>
            </form>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
}
