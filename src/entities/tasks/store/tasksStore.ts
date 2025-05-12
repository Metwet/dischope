import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TaskStore {
  tasks: ITask[];
  setTasks: (task: ITask[]) => void;
  updateTaskDate: (id: number, newDate: string) => void;
  toggleTaskDone: (id: number, done: boolean) => void;
  updateTaskText: (id: number, text: string) => void;
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
        toggleTaskDone: (id, done) => {
          set((state) => {
            const task = state.tasks.find((t) => t.id === id);
            if (task) task.done = done;
          });
        },
        updateTaskText: (id, text) => {
          set((state) => {
            const task = state.tasks.find((t) => t.id === id);
            if (task) task.text = text;
          });
        },
      })),
      { name: "tasks-store" }
    ),
    { name: "TasksStore" }
  )
);
