import { Brightness4, Brightness7 } from "@mui/icons-material";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { FC } from "react";
import styles from "./header.module.css";

interface IHeaderProps {
  theme: TTheme;
  toggleTheme: () => void;
}

const Header: FC<IHeaderProps> = ({ theme, toggleTheme }) => {
  return (
    <Box className={styles.header}>
      <Typography variant="h3">dischope</Typography>
      <Tooltip
        title={
          theme === "light" ? "Включить темную тему" : "Включить светлую тему"
        }
      >
        <IconButton onClick={toggleTheme} color="inherit">
          {theme === "light" ? <Brightness4 /> : <Brightness7 />}
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default Header;
