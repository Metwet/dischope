/**
 * @description Zustand-стор для задач. Хранит задачи в нормализованном виде (tasksById + taskIds).
 */
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TaskStore {
  tasksById: Record<string, ITask>;
  taskIds: string[];
  setTasks: (tasks: ITask[]) => void;
  mergeTasks: (tasks: ITask[]) => void;
  updateTaskField: <K extends keyof ITask>(
    id: string,
    field: K,
    value: ITask[K],
  ) => void;
}

export const useTasksStore = create<TaskStore>()(
  devtools(
    immer((set) => ({
      tasksById: {},
      taskIds: [],
      setTasks: (tasks) => {
        set((state) => {
          state.tasksById = {};
          state.taskIds = [];
          tasks.forEach((task) => {
            state.tasksById[task.id] = task;
            state.taskIds.push(task.id);
          });
        });
      },
      mergeTasks: (tasks) => {
        set((state) => {
          for (const task of tasks) {
            state.tasksById[task.id] = task;
            if (!state.taskIds.includes(task.id)) {
              state.taskIds.push(task.id);
            }
          }
        });
      },
      updateTaskField: (id, field, value) => {
        set((state) => {
          const task = state.tasksById[id];
          if (task) {
            task[field] = value;
          }
          state.tasksById[id] = task;
        });
      },
    })),
    { name: "tasks-store" },
  ),
);
