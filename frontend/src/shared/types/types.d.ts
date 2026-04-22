type TTheme = "light" | "dark";

interface ITaskUser {
  id: string;
  email: string;
  name: string | null;
}

interface ITask {
  id: string;
  title: string;
  completed: boolean;
  sortOrder: number;
  createdAt: string;
  plannedAt: string | null;
  completedAt: string | null;
  updatedAt: string;
  userId: string;
  user?: ITaskUser;
}

interface ISprintOption {
  year: number;
  sprintNumber: number;
  startDate: string;
  endDate: string;
  label: string;
  isCurrent: boolean;
}
