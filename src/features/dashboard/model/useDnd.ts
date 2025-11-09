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
      if (activeContainer === overContainer) return; // внутри той же зоны — onDragEnd

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

      // если ушли в другую зону — уже обработано в onDragOver
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

  return {
    sensors,
    handleDragOver,
    handleDragEnd,
  };
};

