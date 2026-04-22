import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  FormControlLabel,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TaskInput } from "./TaskInput";

type PlannedAtFeedbackStatus = "idle" | "success" | "error";

interface TaskDetailsDialogProps {
  open: boolean;
  task: ITask;
  error: string | null;
  isBusy: boolean;
  plannedAtFeedbackStatus: PlannedAtFeedbackStatus;
  plannedAtFeedbackMessage: string | null;
  onClose: () => void;
  onToggleCompleted: (checked: boolean) => void;
  onPlannedAtChange: (value: Dayjs | null) => void;
  onMoveToNextSprint: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

const formatDayOptionLabel = (value: Dayjs | null) =>
  value
    ? new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      }).format(new Date(`${value.format("YYYY-MM-DD")}T00:00:00.000Z`))
    : "";

const toDayjs = (value: string | null) => (value ? dayjs(value) : null);

export const TaskDetailsDialog = ({
  open,
  task,
  error,
  isBusy,
  plannedAtFeedbackStatus,
  plannedAtFeedbackMessage,
  onClose,
  onToggleCompleted,
  onPlannedAtChange,
  onMoveToNextSprint,
  onDuplicate,
  onDelete,
}: TaskDetailsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent dividers>
        <Box sx={{ display: "grid", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <TaskInput
                id={task.id}
                value={task.title}
                lineThrough={task.completed}
                fullWidth
              />
            </Box>
            <IconButton aria-label="Закрыть" onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          <FormControlLabel
            control={<Checkbox checked={task.completed} />}
            label="Выполнено"
            onChange={(_event, checked) => onToggleCompleted(checked)}
            disabled={isBusy}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <DatePicker
            label="Плановая дата"
            value={toDayjs(task.plannedAt)}
            onChange={(value) =>
              onPlannedAtChange(value ? value.startOf("day") : null)
            }
            disabled={isBusy}
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
                color:
                  plannedAtFeedbackStatus === "success" ? "success" : "primary",
                error: plannedAtFeedbackStatus === "error",
                helperText:
                  plannedAtFeedbackStatus === "error"
                    ? plannedAtFeedbackMessage
                    : plannedAtFeedbackStatus === "success"
                      ? "Дата успешно сохранена"
                      : formatDayOptionLabel(toDayjs(task.plannedAt)) ||
                        "Выберите дату задачи",
              },
            }}
          />
          <DatePicker
            label="Создана"
            value={toDayjs(task.createdAt)}
            disabled
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />

          <DatePicker
            label="Дата завершения"
            value={toDayjs(task.completedAt)}
            disabled
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
          <DatePicker
            label="Обновлена"
            value={toDayjs(task.updatedAt)}
            disabled
            format="DD.MM.YYYY"
            slotProps={{
              textField: {
                fullWidth: true,
              },
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
        <Button
          onClick={onMoveToNextSprint}
          disabled={isBusy}
          variant="outlined"
          fullWidth
        >
          На след. спринт
        </Button>
        <Button
          onClick={onDuplicate}
          disabled={isBusy}
          variant="contained"
          fullWidth
        >
          Дублировать
        </Button>
        <Button
          onClick={onDelete}
          disabled={isBusy}
          color="error"
          variant="contained"
          fullWidth
        >
          Удалить задачу
        </Button>
      </DialogActions>
    </Dialog>
  );
};
