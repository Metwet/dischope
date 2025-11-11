const checkResponse = async <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  } else {
    return res.json().then((err) => Promise.reject(err));
  }
};

export const getTestTasks = async () => {
  return fetch("./test_tasks.json").then((res) =>
    checkResponse<Array<ITask>>(res)
  );
};
