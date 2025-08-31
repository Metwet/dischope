import { DroppableZone } from "@/shared/dnd/DroppableZone/DroppableZone";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Typography } from "@mui/material";
import { memo } from "react";
import { TaskItem } from "./TaskItem";

interface DayColumnProps {
  day: string;
  tasks: number[];
}

const DayColumnComponent = ({ day, tasks }: DayColumnProps) => (
  <Box sx={{ width: "calc(100% / 7 - 16px)", minWidth: "180px" }}>
    <DroppableZone id={day}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <Typography>{day}</Typography>
        {tasks.map((id) => (
          <TaskItem id={id} key={id} />
        ))}
      </SortableContext>
    </DroppableZone>
  </Box>
);

export const DayColumn = memo(DayColumnComponent);
DayColumn.displayName = "DayColumn";
