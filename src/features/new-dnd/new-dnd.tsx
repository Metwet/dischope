"use client";
import { useTaskIds } from "@/entities/tasks/store/selectors";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Box, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { TaskItem } from "./task-item/task-item";
import { DroppableZone } from "@/shared/dnd/DroppableZone/DroppableZone";

export const NewDnd = () => {
  const taskIds = useTaskIds();

  // две зоны: слева задачи, справа пусто
  const [items, setItems] = useState<Record<string, number[]>>({
    left: taskIds,
    right: [],
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // список контейнеров как мемо (удобно для findContainer)
  const containers = useMemo<string[]>(() => ["left", "right"], []);

  const findContainer = (id: UniqueIdentifier): string | undefined => {
    if (id === "left" || id === "right") return id;
    return containers.find((key) => items[key].includes(id as number));
  };

  // перенос МЕЖДУ зонами — делаем во время перетаскивания
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return; // внутри той же зоны — займётся onDragEnd

    setItems((prev) => {
      const activeItems = [...prev[activeContainer]];
      const overItems = [...prev[overContainer]];

      const activeIndex = activeItems.indexOf(active.id as number);
      // убрать из исходной
      activeItems.splice(activeIndex, 1);

      // куда вставлять в целевой
      let overIndex: number;
      if (over.id === overContainer) {
        // нависаем над пустой зоной или над "фоном" контейнера — кидаем в конец
        overIndex = overItems.length;
      } else {
        // нависаем над конкретным элементом — вставим перед ним
        const idx = overItems.indexOf(over.id as number);
        overIndex = idx >= 0 ? idx : overItems.length;
      }

      overItems.splice(overIndex, 0, active.id as number);

      return {
        ...prev,
        [activeContainer]: activeItems,
        [overContainer]: overItems,
      };
    });
  };

  // сортировка ВНУТРИ зоны — по окончании перетаскивания
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    if (!activeContainer || !overContainer) return;

    // если ушли в другую зону — уже обработано в onDragOver
    if (activeContainer !== overContainer) return;

    const activeIndex = items[activeContainer].indexOf(active.id as number);
    const overIndex =
      over.id === overContainer
        ? items[overContainer].length - 1
        : items[overContainer].indexOf(over.id as number);

    if (activeIndex !== overIndex && overIndex >= 0) {
      setItems((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(
          prev[activeContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
  };

  return (
    <Box>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <Grid container spacing={2}>
          <Grid size={6}>
            <DroppableZone id="left">
              <SortableContext
                items={items.left}
                strategy={verticalListSortingStrategy}
              >
                {items.left.map((id) => (
                  <TaskItem id={id} key={id} />
                ))}
              </SortableContext>
            </DroppableZone>
          </Grid>

          <Grid size={6}>
            <DroppableZone id="right">
              <SortableContext
                items={items.right}
                strategy={verticalListSortingStrategy}
              >
                {items.right.map((id) => (
                  <TaskItem id={id} key={id} />
                ))}
              </SortableContext>
            </DroppableZone>
          </Grid>
        </Grid>
      </DndContext>
    </Box>
  );
};
