/**
 * @description Зона сброса задачи в корзину (удаление) в панели дашборда.
 */
"use client";

import { useDroppable } from "@dnd-kit/core";
import { DeleteOutline } from "@mui/icons-material";
import { Box, Tooltip } from "@mui/material";
import { DASHBOARD_TRASH_DROP_ID } from "../model/useDnd";

const DELETE_ZONE_TOOLTIP_TEXT = "Для удаления задачи перетащите её в эту зону";
const DELETE_ZONE_ARIA_LABEL = "Удаление задачи перетаскиванием";

export const TaskTrashDropZone = () => {
  const { setNodeRef, isOver } = useDroppable({ id: DASHBOARD_TRASH_DROP_ID });

  return (
    <Tooltip
      title={DELETE_ZONE_TOOLTIP_TEXT}
      placement="top"
      enterDelay={400}
      describeChild
    >
      <Box
        ref={setNodeRef}
        aria-label={DELETE_ZONE_ARIA_LABEL}
        sx={{
          flexShrink: 0,
          width: 56,
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed",
          borderColor: isOver ? "error.main" : "grey.400",
          bgcolor: isOver ? "error.light" : "action.hover",
          borderRadius: 1,
          color: isOver ? "error.dark" : "text.secondary",
          transition:
            "background-color 120ms ease, border-color 120ms ease, color 120ms ease",
        }}
      >
        <DeleteOutline aria-hidden />
      </Box>
    </Tooltip>
  );
};
