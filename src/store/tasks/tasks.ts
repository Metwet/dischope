import { create } from "zustand";

interface ITodoStore {
  tasks: ITask[];
  addTask: (task: ITask) => void;
  removeTask: (taskId: number) => void;
  toggleTaskCompletion: (taskId: number) => void;
}

export const useTodoStore = create<ITodoStore>((set) => ({
  tasks: [],
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
  toggleTaskCompletion: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.done } : task
      ),
    })),
}));
