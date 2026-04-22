/**
 * @description Карточка задачи с поддержкой drag-and-drop и модалкой деталей.
 */
"use client";

import { useTaskById, useUpdateTaskField } from "../model/selectors";
import { createTask, deleteTask, updateTask } from "../api/taskApi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Checkbox, Paper } from "@mui/material";
import { MouseEvent, SyntheticEvent, useMemo, useState } from "react";
import { TaskDetailsDialog } from "./TaskDetailsDialog";
import { TaskInput } from "./TaskInput";
import { Dayjs } from "dayjs";

interface TaskItemProps {
  id: string;
  onTaskMutated: () => Promise<void>;
}

const SPRINT_DURATION_DAYS = 14;

const toIsoDayStart = (day: string) => `${day}T00:00:00.000Z`;

const addDays = (date: Date, days: number) => {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
};

const getServerErrorMessage = (error: unknown, fallback: string) => {
  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message?: unknown }).message;

    if (typeof message === "string") {
      return message;
    }

    if (
      Array.isArray(message) &&
      message.length > 0 &&
      typeof message[0] === "string"
    ) {
      return message[0];
    }
  }

  return fallback;
};

export const TaskItem = ({ id, onTaskMutated }: TaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shouldReloadAfterClose, setShouldReloadAfterClose] = useState(false);
  const [plannedAtFeedbackStatus, setPlannedAtFeedbackStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [plannedAtFeedbackMessage, setPlannedAtFeedbackMessage] = useState<
    string | null
  >(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const sortableProps = isModalOpen ? {} : { ...attributes, ...listeners };

  const task = useTaskById(id);
  const [modalTaskId, setModalTaskId] = useState(id);
  const updateTaskField = useUpdateTaskField();
  const modalTask = useTaskById(modalTaskId);
  const activeTask = useMemo(() => modalTask ?? task, [modalTask, task]);

  const handleCheck = async (checkedTask: ITask, checked: boolean) => {
    setError(null);
    updateTaskField(checkedTask.id, "completed", checked);
    try {
      const updatedTask = await updateTask(checkedTask.id, {
        completed: checked,
      });
      updateTaskField(checkedTask.id, "completedAt", updatedTask.completedAt);
      updateTaskField(checkedTask.id, "updatedAt", updatedTask.updatedAt);
    } catch {
      updateTaskField(checkedTask.id, "completed", checkedTask.completed);
      setError("Не удалось обновить статус задачи");
    }
  };

  const handleOpenModal = (event: MouseEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.target as Node)) {
      return;
    }

    setError(null);
    setShouldReloadAfterClose(false);
    setPlannedAtFeedbackStatus("idle");
    setPlannedAtFeedbackMessage(null);
    setModalTaskId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setError(null);
    setPlannedAtFeedbackStatus("idle");
    setPlannedAtFeedbackMessage(null);

    if (!shouldReloadAfterClose) {
      return;
    }

    setShouldReloadAfterClose(false);
    void onTaskMutated();
  };

  const handleTaskDateChange = async (value: Dayjs | null) => {
    if (!activeTask) {
      return;
    }

    const nextPlannedAt = value ? toIsoDayStart(value.format("YYYY-MM-DD")) : null;
    const currentPlannedAt = activeTask.plannedAt
      ? toIsoDayStart(activeTask.plannedAt.slice(0, 10))
      : null;

    if (currentPlannedAt === nextPlannedAt) {
      return;
    }

    const previousPlannedAt = activeTask.plannedAt;
    updateTaskField(activeTask.id, "plannedAt", nextPlannedAt);
    setIsBusy(true);
    setError(null);
    setPlannedAtFeedbackStatus("idle");
    setPlannedAtFeedbackMessage(null);

    try {
      const updatedTask = await updateTask(activeTask.id, { plannedAt: nextPlannedAt });
      updateTaskField(activeTask.id, "plannedAt", updatedTask.plannedAt);
      updateTaskField(activeTask.id, "sortOrder", updatedTask.sortOrder);
      updateTaskField(activeTask.id, "updatedAt", updatedTask.updatedAt);
      setShouldReloadAfterClose(true);
      setPlannedAtFeedbackStatus("success");
      setPlannedAtFeedbackMessage(null);
    } catch (caughtError) {
      updateTaskField(activeTask.id, "plannedAt", previousPlannedAt);
      setPlannedAtFeedbackStatus("error");
      setPlannedAtFeedbackMessage(
        getServerErrorMessage(caughtError, "Не удалось изменить плановую дату")
      );
    } finally {
      setIsBusy(false);
    }
  };

  const handleMoveToNextSprint = async () => {
    if (!activeTask) {
      return;
    }

    const baseDate = new Date(activeTask.plannedAt ?? activeTask.createdAt);
    const nextSprintDate = addDays(baseDate, SPRINT_DURATION_DAYS);

    setIsBusy(true);
    setError(null);

    try {
      await updateTask(activeTask.id, {
        plannedAt: toIsoDayStart(nextSprintDate.toISOString().slice(0, 10)),
      });
      setIsModalOpen(false);
      await onTaskMutated();
    } catch {
      setError("Не удалось перенести задачу в следующий спринт");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDuplicate = async () => {
    if (!activeTask) {
      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      const duplicatedTask = await createTask({
        title: `${activeTask.title} (копия)`,
        userId: activeTask.userId,
        ...(activeTask.plannedAt ? { plannedAt: activeTask.plannedAt } : {}),
      });
      await onTaskMutated();
      setModalTaskId(duplicatedTask.id);
      setPlannedAtFeedbackStatus("idle");
      setPlannedAtFeedbackMessage(null);
      setShouldReloadAfterClose(false);
    } catch {
      setError("Не удалось дублировать задачу");
    } finally {
      setIsBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!activeTask) {
      return;
    }

    setIsBusy(true);
    setError(null);

    try {
      await deleteTask(activeTask.id);
      setIsModalOpen(false);
      await onTaskMutated();
    } catch {
      setError("Не удалось удалить задачу");
    } finally {
      setIsBusy(false);
    }
  };

  const stopPropagation = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  if (!task) {
    return null;
  }

  return (
    <Paper
      ref={setNodeRef}
      {...sortableProps}
      style={style}
      onDoubleClick={handleOpenModal}
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        cursor: transform ? "grabbing" : "grab",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          minWidth: 0,
          flex: 1,
        }}
      >
        <Checkbox
          checked={task.completed}
          onChange={(
            _event: SyntheticEvent<Element, Event>,
            checked: boolean,
          ) => {
            void handleCheck(task, checked);
          }}
          onPointerDown={stopPropagation}
          onClick={stopPropagation}
          onDoubleClick={stopPropagation}
        />
        <Box
          onPointerDown={stopPropagation}
          onClick={stopPropagation}
          onDoubleClick={stopPropagation}
          sx={{ minWidth: 0, flex: 1 }}
        >
          <TaskInput id={task.id} value={task.title} lineThrough={task.completed} />
        </Box>
      </Box>
      <TaskDetailsDialog
        open={isModalOpen}
        task={activeTask ?? task}
        error={error}
        isBusy={isBusy}
        plannedAtFeedbackStatus={plannedAtFeedbackStatus}
        plannedAtFeedbackMessage={plannedAtFeedbackMessage}
        onClose={handleCloseModal}
        onToggleCompleted={(checked) => {
          if (activeTask) {
            void handleCheck(activeTask, checked);
          }
        }}
        onPlannedAtChange={(value) => {
          void handleTaskDateChange(value);
        }}
        onMoveToNextSprint={() => {
          void handleMoveToNextSprint();
        }}
        onDuplicate={() => {
          void handleDuplicate();
        }}
        onDelete={() => {
          void handleDelete();
        }}
      />
    </Paper>
  );
};
