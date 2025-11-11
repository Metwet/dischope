import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface TaskStore {
  // tasks: ITask[];
  tasksById: Record<number, ITask>;
  taskIds: number[];
  setTasks: (tasks: ITask[]) => void;
  updateTaskField: <K extends keyof ITask>(
    id: number,
    field: K,
    value: ITask[K]
  ) => void;
}

export const useTasksStore = create<TaskStore>()(
  devtools(
    //persist(
    immer((set) => ({
      // tasks: [],
      tasksById: {},
      taskIds: [],
      setTasks: (tasks) => {
        set((state) => {
          //state.tasks = tasks;
          state.tasksById = {};
          state.taskIds = [];
          tasks.forEach((task) => {
            state.tasksById[task.id] = task;
            state.taskIds.push(task.id);
          });
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
    { name: "tasks-store" }
    // ),
    // { name: "TaskStore" }
  )
);
