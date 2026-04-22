import dayjs, { Dayjs } from "dayjs";
import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  getSprintYears,
  getSprints,
  getTasks,
  reorderTasks,
  useSetTasks,
  useTasksById,
  useUpdateTaskField,
} from "@/entities/task";
import { useAuthStore } from "@/entities/auth";
import { useDays } from "./useDays";
import { DragCommitParams, useDnd } from "./useDnd";

export const useDashboard = () => {
  const currentYear = new Date().getFullYear();
  const user = useAuthStore((state) => state.user);
  const setTasks = useSetTasks();
  const tasksById = useTasksById();
  const updateTaskField = useUpdateTaskField();

  const [yearOptions, setYearOptions] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [sprintOptions, setSprintOptions] = useState<ISprintOption[]>([]);
  const [selectedSprint, setSelectedSprint] = useState<ISprintOption | null>(
    null,
  );
  const [isLoadingSprints, setIsLoadingSprints] = useState(true);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState<Dayjs | null>(
    dayjs().startOf("day"),
  );
  const [error, setError] = useState<string | null>(null);

  const { days, daysTasks, setDaysTasks, createDays } = useDays();

  const handleTasksCommit = useCallback(
    async ({
      nextDaysTasks,
      previousDaysTasks,
      sourceDay,
      targetDay,
    }: DragCommitParams) => {
      const affectedDays = [...new Set([sourceDay, targetDay])];
      const requestDays = affectedDays
        .map((day) => ({
          day,
          taskIds: nextDaysTasks[day] ?? [],
        }))
        .filter(({ taskIds }) => taskIds.length > 0);

      const previousTaskState = new Map<
        string,
        Pick<ITask, "plannedAt" | "sortOrder" | "updatedAt">
      >();

      affectedDays.forEach((day) => {
        const dayTaskIds = [
          ...(previousDaysTasks[day] ?? []),
          ...(nextDaysTasks[day] ?? []),
        ];

        dayTaskIds.forEach((taskId) => {
          const task = tasksById[taskId];

          if (task && !previousTaskState.has(taskId)) {
            previousTaskState.set(taskId, {
              plannedAt: task.plannedAt,
              sortOrder: task.sortOrder,
              updatedAt: task.updatedAt,
            });
          }
        });
      });

      requestDays.forEach(({ day, taskIds }) => {
        taskIds.forEach((taskId, index) => {
          updateTaskField(taskId, "plannedAt", `${day}T00:00:00.000Z`);
          updateTaskField(taskId, "sortOrder", index);
        });
      });

      try {
        const updatedTasks = await reorderTasks({ days: requestDays });

        updatedTasks.forEach((task) => {
          updateTaskField(task.id, "plannedAt", task.plannedAt);
          updateTaskField(task.id, "sortOrder", task.sortOrder);
          updateTaskField(task.id, "updatedAt", task.updatedAt);
        });
      } catch {
        previousTaskState.forEach((taskState, taskId) => {
          updateTaskField(taskId, "plannedAt", taskState.plannedAt);
          updateTaskField(taskId, "sortOrder", taskState.sortOrder);
          updateTaskField(taskId, "updatedAt", taskState.updatedAt);
        });
        setError("Не удалось сохранить порядок задач");
        throw new Error("Task reorder failed");
      }
    },
    [tasksById, updateTaskField],
  );

  const loadTasks = useCallback(
    async (sprint: ISprintOption | null) => {
      if (!user?.id || !sprint) {
        setIsLoadingTasks(false);
        setTasks([]);
        createDays([], sprint);
        return;
      }

      setIsLoadingTasks(true);
      setError(null);

      try {
        const data = await getTasks({
          userId: user.id,
          sprintYear: sprint.year,
          sprintNumber: sprint.sprintNumber,
        });

        setTasks(data);
        createDays(data, sprint);
      } catch {
        setTasks([]);
        createDays([], sprint);
        setError("Не удалось загрузить задачи выбранного спринта");
      } finally {
        setIsLoadingTasks(false);
      }
    },
    [createDays, setTasks, user?.id],
  );

  const {
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleDragEnd,
  } = useDnd({
    days,
    daysTasks,
    setDaysTasks,
    onTasksCommit: handleTasksCommit,
  });

  useEffect(() => {
    const loadSprintYears = async () => {
      if (!user?.id) {
        setYearOptions([]);
        setSelectedYear(null);
        setSprintOptions([]);
        setSelectedSprint(null);
        return;
      }

      setError(null);

      try {
        const nextYears = await getSprintYears(user.id);
        setYearOptions(nextYears);
        setSelectedYear((previousYear) => {
          if (previousYear && nextYears.includes(previousYear)) {
            return previousYear;
          }

          if (nextYears.includes(currentYear)) {
            return currentYear;
          }

          return nextYears.at(-1) ?? null;
        });
      } catch {
        setYearOptions([]);
        setSelectedYear(null);
        setSprintOptions([]);
        setSelectedSprint(null);
        setError("Не удалось загрузить доступные годы");
      }
    };

    void loadSprintYears();
  }, [currentYear, user?.id]);

  useEffect(() => {
    const loadSprintOptions = async () => {
      if (selectedYear === null) {
        setIsLoadingSprints(false);
        setSprintOptions([]);
        setSelectedSprint(null);
        return;
      }

      setIsLoadingSprints(true);
      setError(null);

      try {
        const nextOptions = await getSprints(selectedYear);
        setSprintOptions(nextOptions);

        setSelectedSprint((previousSprint) => {
          if (
            previousSprint &&
            previousSprint.year === selectedYear &&
            nextOptions.some(
              (option) => option.sprintNumber === previousSprint.sprintNumber,
            )
          ) {
            return previousSprint;
          }

          const defaultSprint =
            selectedYear === currentYear
              ? nextOptions.find((option) => option.isCurrent)
              : null;

          return defaultSprint ?? nextOptions[0] ?? null;
        });
      } catch {
        setSprintOptions([]);
        setSelectedSprint(null);
        setError("Не удалось загрузить список спринтов");
      } finally {
        setIsLoadingSprints(false);
      }
    };

    void loadSprintOptions();
  }, [currentYear, selectedYear]);

  useEffect(() => {
    void loadTasks(selectedSprint);
  }, [loadTasks, selectedSprint]);

  const handleOpenCreateModal = useCallback(() => {
    setNewTaskTitle("");
    setNewTaskDate(dayjs().startOf("day"));
    setIsCreateModalOpen(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    if (isCreatingTask) {
      return;
    }

    setIsCreateModalOpen(false);
    setNewTaskTitle("");
    setNewTaskDate(dayjs().startOf("day"));
  }, [isCreatingTask]);

  const handleCreateTask = useCallback(async () => {
    if (!user?.id || !newTaskTitle.trim() || !newTaskDate || !selectedSprint) {
      return;
    }

    setIsCreatingTask(true);
    setError(null);

    try {
      await createTask({
        title: newTaskTitle.trim(),
        userId: user.id,
        plannedAt: `${newTaskDate.format("YYYY-MM-DD")}T00:00:00.000Z`,
      });

      setIsCreateModalOpen(false);
      setNewTaskTitle("");
      setNewTaskDate(dayjs().startOf("day"));
      await loadTasks(selectedSprint);
    } catch {
      setError("Не удалось создать задачу");
    } finally {
      setIsCreatingTask(false);
    }
  }, [loadTasks, newTaskDate, newTaskTitle, selectedSprint, user?.id]);

  const reloadSelectedSprintTasks = useCallback(async () => {
    await loadTasks(selectedSprint);
  }, [loadTasks, selectedSprint]);

  return {
    days,
    daysTasks,
    error,
    handleCloseCreateModal,
    handleCreateTask,
    handleDragCancel,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
    handleOpenCreateModal,
    isCreateModalOpen,
    isCreatingTask,
    isLoadingSprints,
    isLoadingTasks,
    newTaskDate,
    newTaskTitle,
    selectedSprint,
    selectedYear,
    sensors,
    sprintOptions,
    yearOptions,
    reloadSelectedSprintTasks,
    setNewTaskDate,
    setNewTaskTitle,
    setSelectedSprint,
    setSelectedYear,
  };
};
