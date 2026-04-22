/**
 * @description Зона сброса для drag-and-drop. Подсвечивает границу при наведении перетаскиваемого элемента.
 */
import { useDroppable } from "@dnd-kit/core";
import { Box } from "@mui/material";
import { ReactNode } from "react";

export const DroppableZone = ({
  id,
  children,
  borderStyle = "dashed",
}: {
  id: string;
  children: ReactNode;
  borderStyle?: "dashed" | "solid";
}) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: `1px ${borderStyle}`,
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
