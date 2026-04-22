import {
  Autocomplete,
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";

interface DashboardToolbarProps {
  yearOptions: number[];
  selectedYear: number | null;
  onYearChange: (year: number) => void;
  sprintOptions: ISprintOption[];
  selectedSprint: ISprintOption | null;
  isLoadingSprints: boolean;
  onSprintChange: (sprint: ISprintOption | null) => void;
  onCreateTaskClick: () => void;
  isCreateTaskDisabled: boolean;
}

export const DashboardToolbar = ({
  yearOptions,
  selectedYear,
  onYearChange,
  sprintOptions,
  selectedSprint,
  isLoadingSprints,
  onSprintChange,
  onCreateTaskClick,
  isCreateTaskDisabled,
}: DashboardToolbarProps) => {
  const selectedSprintIndex = selectedSprint
    ? sprintOptions.findIndex(
        (option) =>
          option.year === selectedSprint.year &&
          option.sprintNumber === selectedSprint.sprintNumber,
      )
    : -1;

  const previousSprint =
    selectedSprintIndex > 0 ? sprintOptions[selectedSprintIndex - 1] : null;
  const nextSprint =
    selectedSprintIndex >= 0 && selectedSprintIndex < sprintOptions.length - 1
      ? sprintOptions[selectedSprintIndex + 1]
      : null;

  const isSprintNavigationDisabled = !selectedYear || !sprintOptions.length;

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          md: "220px minmax(0, 1fr)",
          xl: "220px minmax(320px, 1fr) auto",
        },
        alignItems: "start",
      }}
    >
      <TextField
        select
        label="Год"
        value={selectedYear ?? ""}
        onChange={(event) => onYearChange(Number(event.target.value))}
        disabled={!yearOptions.length}
      >
        {yearOptions.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </TextField>

      <Box
        sx={{
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          gridColumn: {
            xs: "1 / -1",
            md: "2 / 3",
          },
        }}
      >
        <IconButton
          aria-label="Предыдущий спринт"
          onClick={() => previousSprint && onSprintChange(previousSprint)}
          disabled={isSprintNavigationDisabled || !previousSprint}
          size="small"
          sx={{ p: 0.5 }}
        >
          <KeyboardArrowLeft />
        </IconButton>

        <Autocomplete
          options={sprintOptions}
          value={selectedSprint}
          loading={isLoadingSprints}
          onChange={(_event, value) => onSprintChange(value)}
          disabled={!selectedYear}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) =>
            option.year === value.year &&
            option.sprintNumber === value.sprintNumber
          }
          sx={{ flex: 1, minWidth: 0 }}
          renderOption={(props, option) => {
            const { key, ...optionProps } = props;
            return (
              <Box
                key={key}
                component="li"
                {...optionProps}
                sx={{
                  bgcolor: option.isCurrent ? "success.light" : undefined,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: option.isCurrent ? 700 : 400 }}
                >
                  {option.label}
                  {option.isCurrent ? " (текущий)" : ""}
                </Typography>
              </Box>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Спринт"
              placeholder="Выберите спринт"
            />
          )}
        />

        <IconButton
          aria-label="Следующий спринт"
          onClick={() => nextSprint && onSprintChange(nextSprint)}
          disabled={isSprintNavigationDisabled || !nextSprint}
          size="small"
          sx={{ p: 0.5 }}
        >
          <KeyboardArrowRight />
        </IconButton>
      </Box>

      <Button
        variant="contained"
        onClick={onCreateTaskClick}
        disabled={isCreateTaskDisabled}
        sx={{
          minWidth: 180,
          height: 56,
          width: {
            xs: "100%",
            xl: "auto",
          },
          gridColumn: {
            xs: "1 / -1",
            md: "1 / -1",
            xl: "3 / 4",
          },
        }}
      >
        Создать задачу
      </Button>
    </Box>
  );
};
