/**
 * @description Хук для группировки задач по дням внутри выбранного спринта.
 */
import { useCallback, useState } from "react";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const normalizeTaskDate = (task: ITask) =>
  new Date(task.plannedAt ?? task.createdAt).toISOString().slice(0, 10);

export const useDays = () => {
  const [days, setDays] = useState<string[]>([]);
  const [daysTasks, setDaysTasks] = useState<Record<string, string[]>>({});

  const createDayTasks = useCallback((tasks: ITask[], allDays: string[]) => {
    const allDaysTasks = allDays.reduce(
      (acc: Record<string, string[]>, date: string) => {
        acc[date] = [];
        return acc;
      },
      {}
    );
    tasks.forEach((task) => {
      const date = normalizeTaskDate(task);
      if (allDaysTasks[date]) {
        allDaysTasks[date].push(task.id);
      }
    });
    setDaysTasks(allDaysTasks);
  }, []);

  const createDays = useCallback(
    (tasks: ITask[], sprint: ISprintOption | null) => {
      if (!sprint) {
        setDays([]);
        setDaysTasks({});
        return;
      }

      const allDays: string[] = [];
      const current = new Date(`${sprint.startDate}T00:00:00.000Z`);
      const sprintEnd = new Date(`${sprint.endDate}T00:00:00.000Z`);

      while (current <= sprintEnd) {
        allDays.push(current.toISOString().slice(0, 10));
        current.setTime(current.getTime() + DAY_IN_MS);
      }

      setDays(allDays);
      createDayTasks(tasks, allDays);
    },
    [createDayTasks]
  );

  return { days, daysTasks, setDaysTasks, createDays };
};
