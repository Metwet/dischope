import { Button, Autocomplete, Box, MenuItem, TextField } from "@mui/material";

interface DashboardFiltersProps {
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

export const DashboardFilters = ({
  yearOptions,
  selectedYear,
  onYearChange,
  sprintOptions,
  selectedSprint,
  isLoadingSprints,
  onSprintChange,
  onCreateTaskClick,
  isCreateTaskDisabled,
}: DashboardFiltersProps) => {
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

      <Autocomplete
        options={sprintOptions}
        value={selectedSprint}
        loading={isLoadingSprints}
        onChange={(_event, value) => onSprintChange(value)}
        disabled={!selectedYear}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) =>
          option.year === value.year && option.sprintNumber === value.sprintNumber
        }
        sx={{
          minWidth: 0,
          gridColumn: {
            xs: "1 / -1",
            md: "2 / 3",
          },
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Спринт"
            placeholder="Выберите спринт"
          />
        )}
      />

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
