import { useSortable } from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { FC } from "react";
import { CSS } from "@dnd-kit/utilities";
import { useTaskById } from "@/entities/tasks/store/selectors";

interface TaskItemProps {
  id: number;
}

export const TaskItem: FC<TaskItemProps> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const task = useTaskById(id);

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
