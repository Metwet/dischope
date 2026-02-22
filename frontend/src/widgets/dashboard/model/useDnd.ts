/**
 * @description Хук с логикой drag-and-drop для карточек задач между колонками дней.
 */
import { useCallback } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

interface UseDndParams {
  days: string[];
  daysTasks: Record<string, number[]>;
  setDaysTasks: React.Dispatch<
    React.SetStateAction<Record<string, number[]>>
  >;
}

export const useDnd = ({ days, daysTasks, setDaysTasks }: UseDndParams) => {
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

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);

      if (!activeContainer || !overContainer) return;
      if (activeContainer === overContainer) return;

      setDaysTasks((prev) => {
        const activeItems = [...prev[activeContainer]];
        const overItems = [...prev[overContainer]];

        const activeIndex = activeItems.indexOf(active.id as number);
        activeItems.splice(activeIndex, 1);

        let overIndex: number;
        if (over.id === overContainer) {
          overIndex = overItems.length;
        } else {
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
    },
    [findContainer, setDaysTasks]
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);
      if (!activeContainer || !overContainer) return;

      if (activeContainer !== overContainer) return;

      const activeIndex = daysTasks[activeContainer].indexOf(
        active.id as number
      );
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
    },
    [daysTasks, findContainer, setDaysTasks]
  );

  return { sensors, handleDragOver, handleDragEnd };
};
