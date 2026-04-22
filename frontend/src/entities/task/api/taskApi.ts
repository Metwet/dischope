/**
 * @description API-методы для работы с задачами.
 */
import { checkResponse } from "@/shared/api/httpClient";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface GetTasksParams {
  userId: string;
  sprintYear?: number;
  sprintNumber?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  completed?: boolean;
  plannedAt?: string | null;
  sortOrder?: number;
}

export interface CreateTaskRequest {
  title: string;
  userId: string;
  plannedAt?: string;
}

export interface ReorderTasksRequest {
  days: Array<{
    day: string;
    taskIds: string[];
  }>;
}

export const getTasks = async ({
  userId,
  sprintYear,
  sprintNumber,
}: GetTasksParams): Promise<ITask[]> => {
  const searchParams = new URLSearchParams({ userId });

  if (sprintYear !== undefined) {
    searchParams.set("sprintYear", String(sprintYear));
  }

  if (sprintNumber !== undefined) {
    searchParams.set("sprintNumber", String(sprintNumber));
  }

  return fetch(`${API_URL}/tasks?${searchParams.toString()}`).then((res) =>
    checkResponse<ITask[]>(res)
  );
};

export const getSprints = async (year: number): Promise<ISprintOption[]> => {
  return fetch(`${API_URL}/tasks/sprints?year=${year}`).then((res) =>
    checkResponse<ISprintOption[]>(res)
  );
};

export const getSprintYears = async (userId: string): Promise<number[]> => {
  return fetch(`${API_URL}/tasks/sprint-years?userId=${userId}`).then((res) =>
    checkResponse<number[]>(res)
  );
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskRequest
): Promise<ITask> => {
  return fetch(`${API_URL}/tasks/${taskId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<ITask>(res));
};

export const createTask = async (data: CreateTaskRequest): Promise<ITask> => {
  return fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<ITask>(res));
};

export const deleteTask = async (taskId: string): Promise<{ message: string }> => {
  return fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
  }).then((res) => checkResponse<{ message: string }>(res));
};

export const reorderTasks = async (
  data: ReorderTasksRequest
): Promise<ITask[]> => {
  return fetch(`${API_URL}/tasks/reorder`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => checkResponse<ITask[]>(res));
};
