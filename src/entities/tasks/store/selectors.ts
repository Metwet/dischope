import { useTasksStore } from "./tasksStore";

export const useTaskIds = () => useTasksStore((state) => state.taskIds);
export const useTasksById = () => useTasksStore((state) => state.tasksById);
export const useTaskById = (id: number) =>
  useTasksStore((state) => state.tasksById[id]);
export const useSetTasks = () => useTasksStore((state) => state.setTasks);
export const useUpdateTaskField = () =>
  useTasksStore((state) => state.updateTaskField);
