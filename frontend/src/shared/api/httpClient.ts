/**
 * @description Базовый HTTP-клиент. Проверяет ответ сервера и возвращает JSON или отклоняет промис с ошибкой.
 */
export const checkResponse = async <T>(res: Response): Promise<T> => {
  if (res.ok) {
    return res.json();
  } else {
    return res.json().then((err) => Promise.reject(err));
  }
};
