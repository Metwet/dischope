import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export const DroppableZone = ({
  id,
  children,
}: {
  id: string;
  children: ReactNode;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: "1px dashed",
        borderColor: isOver ? "primary.main" : "grey.400",
        bgcolor: isOver ? "action.hover" : "transparent",
        borderRadius: 1,
        minHeight: 200,
        p: 1,
        transition: "background-color 120ms ease",
      }}
    >
      {children}
    </Box>
  );
};
