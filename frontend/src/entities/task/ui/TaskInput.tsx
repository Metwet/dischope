/**
 * @description Текстовый инпут для редактирования задачи с debounce-сохранением в стор.
 */
import { useUpdateTaskField } from "../model/selectors";
import { updateTask } from "../api/taskApi";
import { Input } from "@mui/material";
import { ChangeEvent, FC, useEffect, useRef, useState } from "react";

interface ITaskInputProps {
  id: string;
  value: string;
  lineThrough: boolean;
  fullWidth?: boolean;
}

export const TaskInput: FC<ITaskInputProps> = ({
  id,
  value,
  lineThrough,
  fullWidth = false,
}) => {
  const updateTaskField = useUpdateTaskField();
  const [text, setText] = useState<string>(value);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      updateTaskField(id, "title", newValue);
      void updateTask(id, { title: newValue }).catch(() => {
        updateTaskField(id, "title", value);
        setText(value);
      });
    }, 300);
  };

  useEffect(() => {
    setText(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Input
      value={text}
      onChange={handleInputChange}
      fullWidth={fullWidth}
      sx={{ textDecoration: lineThrough ? "line-through" : "none" }}
      disableUnderline
      multiline
    />
  );
};
