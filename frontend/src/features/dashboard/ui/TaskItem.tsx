import {
  useTaskById,
  useUpdateTaskField,
} from "@/entities/tasks/store/selectors";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { SyntheticEvent } from "react";
import { TaskInput } from "./TaskInput";
import { DragIndicator } from "@mui/icons-material";

interface TaskItemProps {
  id: number;
}

export const TaskItem = ({ id }: TaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const task = useTaskById(id);
  const updateTaskField = useUpdateTaskField();

  const handleCheck = (checkedTask: ITask, checked: boolean) => {
    updateTaskField(checkedTask.id, "done", checked);
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      sx={{
        m: 1,
        p: 2,
        backgroundColor: "blue",
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormControlLabel
        control={<Checkbox />}
        label={
          <Box>
            <TaskInput id={task.id} value={task.text} lineThrough={task.done} />
          </Box>
        }
        checked={task.done}
        onChange={(_event: SyntheticEvent<Element, Event>, checked: boolean) =>
          handleCheck(task, checked)
        }
      />
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: transform ? "grabbing" : "grab",
        }}
      >
        <DragIndicator />
      </Box>
    </Box>
  );
};
