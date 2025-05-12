import { useSortable } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";

interface TaskItemProps {
  task: ITask;
}

export const TaskItem: FC<TaskItemProps> = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      sx={{
        m: 1,
        p: 2,
        backgroundColor: "blue",
        cursor: transform ? "grabbing" : "grab",
      }}
    >
      {task.text}
    </Box>
  );
};
