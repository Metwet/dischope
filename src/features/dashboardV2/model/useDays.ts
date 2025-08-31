import { useState } from "react";

export const useDays = () => {
  const [days, setDays] = useState<string[]>([]);
  const [daysTasks, setDaysTasks] = useState<Record<string, number[]>>({});

  const createDays = (tasks: ITask[]) => {
    if (tasks.length === 0) {
      setDays([]);
      setDaysTasks({});
      return;
    }

    const dates = [
      ...new Set(tasks.map((task) => new Date(task.create_date).getTime())),
    ].sort((a, b) => a - b);

    const minDate = new Date(dates[0]);
    const maxDate = new Date(dates[dates.length - 1]);

    const allDays = [];
    const current = new Date(minDate);

    while (current <= maxDate) {
      allDays.push(current.toDateString());
      current.setDate(current.getDate() + 1);
    }

    setDays(allDays);
    createDayTasks(tasks, allDays);
  };

  const createDayTasks = (tasks: ITask[], allDays: string[]) => {
    const allDaysTasks = allDays.reduce(
      (acc: Record<string, number[]>, date: string) => {
        acc[date] = [];
        return acc;
      },
      {}
    );
    tasks.forEach((task) => {
      const date = new Date(task.create_date).toDateString();
      allDaysTasks[date].push(task.id);
    });
    setDaysTasks(allDaysTasks);
  };

  return { days, daysTasks, setDaysTasks, createDays };
};
