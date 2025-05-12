import { useTasks } from "@/entities/tasks/store/selectors";
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
  const tasks = useTasks();
  const [sortableTasks, setSortableTasks] = useState<ITask[]>(tasks);
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
      const oldIndex = sortableTasks.findIndex((task) => task.id === active.id);
      const newIndex = sortableTasks.findIndex((task) => task.id === over.id);
      console.log({ sortableTasks, oldIndex, newIndex, active, over });

      setSortableTasks(arrayMove(sortableTasks, oldIndex, newIndex));
    }
  };

  return (
    <Box>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={sortableTasks}>
          {sortableTasks.map((task) => (
            <TaskItem task={task} key={task.id} />
          ))}
        </SortableContext>
      </DndContext>
    </Box>
  );
};
