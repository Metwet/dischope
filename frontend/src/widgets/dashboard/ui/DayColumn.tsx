/**
 * @description Колонка дня с задачами. Оборачивает список задач в droppable-зону и sortable-контекст.
 */
import { DroppableZone } from "@/shared/dnd";
import { TaskItem } from "@/entities/task";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Typography } from "@mui/material";
import { memo } from "react";

const formatDayLabel = (day: string) =>
  new Intl.DateTimeFormat("ru-RU", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(`${day}T00:00:00.000Z`));

interface DayColumnProps {
  day: string;
  tasks: string[];
}

const DayColumnComponent = ({ day, tasks }: DayColumnProps) => (
  <Box sx={{ width: "calc(100% / 7 - 16px)", minWidth: "180px" }}>
    <DroppableZone id={day}>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        <Typography sx={{ textTransform: "capitalize", mb: 1 }}>
          {formatDayLabel(day)}
        </Typography>
        {tasks.map((id) => (
          <TaskItem id={id} key={id} />
        ))}
      </SortableContext>
    </DroppableZone>
  </Box>
);

export const DayColumn = memo(DayColumnComponent);
DayColumn.displayName = "DayColumn";
