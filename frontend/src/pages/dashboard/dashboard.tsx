/**
 * @description Страница дашборда.
 */
import { Dashboard } from "@/widgets/dashboard";
import { Box, Typography } from "@mui/material";

const DashboardPage = () => {
  return (
    <Box>
      <Typography>Dashboard</Typography>
      <Dashboard />
    </Box>
  );
};

export default DashboardPage;
