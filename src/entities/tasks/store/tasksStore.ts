import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TaskStore {
  tasks: ITask[];
  setTasks: (task: ITask[]) => void;
  updateTaskDate: (id: number, newDate: string) => void;
}

export const useTasksStore = create<TaskStore>()(
  devtools(
    persist(
      immer((set) => ({
        tasks: [],
        setTasks: (tasks) => {
          set((state) => {
            state.tasks = tasks;
          });
        },
        updateTaskDate: (id, newDate) => {
          set((state) => {
            const task = state.tasks.find((t) => t.id === id);
            if (task) task.create_date = newDate;
          });
        },
      })),
      { name: "tasks-store" }
    ),
    { name: "TasksStore" }
  )
);
