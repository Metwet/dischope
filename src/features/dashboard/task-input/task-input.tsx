import { Input } from "@mui/material";
import styles from "./task-input.module.css";
import { ChangeEvent, FC } from "react";

interface ITaskInputProps {
  value: string;
  handleInputChange: (event: ChangeEvent) => void;
  lineThrough: boolean;
}

const TaskInput: FC<ITaskInputProps> = ({
  value,
  handleInputChange,
  lineThrough,
}) => {
  return (
    <Input
      value={value}
      onChange={handleInputChange}
      className={`${lineThrough ? styles.lineThrough : ""}`}
      disableUnderline
      multiline
    />
  );
};

export default TaskInput;
