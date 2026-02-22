/**
 * @description API-методы для работы с задачами.
 */
import { checkResponse } from "@/shared/api/httpClient";

export const getTestTasks = async (): Promise<ITask[]> => {
  return fetch("./test_tasks.json").then((res) =>
    checkResponse<ITask[]>(res)
  );
};
