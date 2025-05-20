import { useTaskIds } from "@/entities/tasks/store/selectors";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Box } from "@mui/material";
import { useState } from "react";
import { TaskItem } from "./task-item/task-item";

export const NewDnd = () => {
  const taskIds = useTaskIds();
  const [sortableTaskIds, setSortableTaskIds] = useState<number[]>(taskIds);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = sortableTaskIds.findIndex((task) => task === active.id);
      const newIndex = sortableTaskIds.findIndex((task) => task === over.id);
      console.log({ sortableTaskIds, oldIndex, newIndex, active, over });

      setSortableTaskIds(arrayMove(sortableTaskIds, oldIndex, newIndex));
    }
  };

  return (
    <Box>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={sortableTaskIds}>
          {sortableTaskIds.map((id) => (
            <TaskItem id={id} key={id} />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};
