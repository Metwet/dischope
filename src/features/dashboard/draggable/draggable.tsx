import { useDraggable } from "@dnd-kit/core";
import { DragIndicator } from "@mui/icons-material";
import { Box } from "@mui/material";
import { FC, ReactNode } from "react";

interface IDraggableProps {
  children: ReactNode;
  id: string;
}

const Draggable: FC<IDraggableProps> = ({ children, id }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Box display="flex" gap={1}>
        {children}
        <DragIndicator {...listeners} />
      </Box>
    </div>
  );
};

export default Draggable;
