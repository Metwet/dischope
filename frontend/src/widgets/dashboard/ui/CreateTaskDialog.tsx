import { Dayjs } from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const formatDayOptionLabel = (day: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${day}T00:00:00.000Z`));

interface CreateTaskDialogProps {
  open: boolean;
  title: string;
  date: Dayjs | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onTitleChange: (value: string) => void;
  onDateChange: (value: Dayjs | null) => void;
}

export const CreateTaskDialog = ({
  open,
  title,
  date,
  isSubmitting,
  onClose,
  onSubmit,
  onTitleChange,
  onDateChange,
}: CreateTaskDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Создать задачу</DialogTitle>
      <DialogContent dividers sx={{ overflow: "visible" }}>
        <Box sx={{ display: "grid", gap: 2, mt: 1 }}>
          <TextField
            autoFocus
            label="Название задачи"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            disabled={isSubmitting}
            fullWidth
          />

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
            <DatePicker
              label="День спринта"
              value={date}
              onChange={(value) => onDateChange(value ? value.startOf("day") : null)}
              disabled={isSubmitting}
              format="DD.MM.YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: date
                    ? formatDayOptionLabel(date.format("YYYY-MM-DD"))
                    : "Выберите дату задачи",
                },
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSubmitting || !title.trim() || !date}
        >
          Создать
        </Button>
      </DialogActions>
    </Dialog>
  );
};
