import { useUpdateTaskField } from "@/entities/tasks/store/selectors";
import { Input } from "@mui/material";
import { ChangeEvent, FC, useRef, useState } from "react";

interface ITaskInputProps {
  id: number;
  value: string;
  lineThrough: boolean;
}

export const TaskInput: FC<ITaskInputProps> = ({ id, value, lineThrough }) => {
  const updateTaskField = useUpdateTaskField();
  const [text, setText] = useState<string>(value);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    // Очистка старого таймера
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    // Установка нового таймера
    debounceTimer.current = setTimeout(() => {
      updateTaskField(id, "text", newValue);
    }, 300);
  };

  return (
    <Input
      value={text}
      onChange={handleInputChange}
      sx={{ textDecoration: lineThrough ? "line-through" : "none" }}
      disableUnderline
      multiline
    />
  );
};
