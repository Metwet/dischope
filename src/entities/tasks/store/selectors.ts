import { useTasksStore } from "./tasksStore";

export const useTasks = () => useTasksStore((state) => state.tasks);
export const useSetTasks = () => useTasksStore((state) => state.setTasks);
export const useUpdateTaskDate = () =>
  useTasksStore((state) => state.updateTaskDate);
export const useToggleTaskDone = () =>
  useTasksStore((state) => state.toggleTaskDone);
export const useUpdateTaskText = () =>
  useTasksStore((state) => state.updateTaskText);
