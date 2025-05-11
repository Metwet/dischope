import { Input } from "@mui/material";
import { ChangeEvent, FC } from "react";

interface ITaskInputProps {
  value: string;
  handleInputChange: (event: ChangeEvent) => void;
  lineThrough: boolean;
}

export const TaskInput: FC<ITaskInputProps> = ({
  value,
  handleInputChange,
  lineThrough,
}) => {
  return (
    <Input
      value={value}
      onChange={handleInputChange}
      sx={{ textDecoration: lineThrough ? "line-through" : "none" }}
      disableUnderline
      multiline
    />
  );
};
