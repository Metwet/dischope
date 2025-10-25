"use client";
import { useSetTasks, useTaskIds } from "@/entities/tasks/store/selectors";
import { getTestTasks } from "@/shared/api/dashboard-api";
import { useCallback, useEffect } from "react";
import { useDays } from "./model/useDays";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Box, FormGroup } from "@mui/material";
import { DayColumn } from "./ui/DayColumn";

export const Dashboard = () => {
  const taskIds = useTaskIds();
  const setTasks = useSetTasks();

  const { days, daysTasks, setDaysTasks, createDays } = useDays();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const findContainer = useCallback(
    (id: UniqueIdentifier): string | undefined => {
      if (days.includes(id as string)) return id as string;
      return days.find((key) => daysTasks[key].includes(id as number));
    },
    [days, daysTasks]
  );

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);

    if (!activeContainer || !overContainer) return;
    if (activeContainer === overContainer) return; // внутри той же зоны —  onDragEnd

    setDaysTasks((prev) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over.id);
    if (!activeContainer || !overContainer) return;

    // если ушли в другую зону — уже обработано в onDragOver
    if (activeContainer !== overContainer) return;

    const activeIndex = daysTasks[activeContainer].indexOf(active.id as number);
    const overIndex =
      over.id === overContainer
        ? daysTasks[overContainer].length - 1
        : daysTasks[overContainer].indexOf(over.id as number);

    if (activeIndex !== overIndex && overIndex >= 0) {
      setDaysTasks((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(
          prev[activeContainer],
          activeIndex,
          overIndex
        ),
      }));
    }
  };

  useEffect(() => {
    if (!taskIds.length) {
      getTestTasks().then((data) => {
        setTasks(data);
        createDays(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <FormGroup>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {days.map((day) => (
            <DayColumn key={day} day={day} tasks={daysTasks[day]} />
          ))}
        </Box>
      </FormGroup>
    </DndContext>
  );
};
