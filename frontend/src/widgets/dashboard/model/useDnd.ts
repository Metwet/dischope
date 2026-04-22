/**
 * @description Хук с логикой drag-and-drop для карточек задач между колонками дней.
 */
import { useCallback, useRef } from "react";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

export interface DragCommitParams {
  nextDaysTasks: Record<string, string[]>;
  previousDaysTasks: Record<string, string[]>;
  sourceDay: string;
  targetDay: string;
}

interface UseDndParams {
  days: string[];
  daysTasks: Record<string, string[]>;
  setDaysTasks: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  onTasksCommit?: (params: DragCommitParams) => Promise<void> | void;
}

interface DragMeta {
  day: string;
  snapshot: Record<string, string[]>;
}

export const useDnd = ({
  days,
  daysTasks,
  setDaysTasks,
  onTasksCommit,
}: UseDndParams) => {
  const dragMetaRef = useRef<DragMeta | null>(null);

  const cloneDaysTasks = useCallback(
    (value: Record<string, string[]>) =>
      Object.fromEntries(
        Object.entries(value).map(([day, taskIds]) => [day, [...taskIds]]),
      ),
    [],
  );

  const isSameLayout = useCallback(
    (
      first: Record<string, string[]>,
      second: Record<string, string[]>,
    ): boolean =>
      Object.keys({ ...first, ...second }).every((day) => {
        const firstIds = first[day] ?? [];
        const secondIds = second[day] ?? [];

        return (
          firstIds.length === secondIds.length &&
          firstIds.every((taskId, index) => taskId === secondIds[index])
        );
      }),
    [],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const findContainer = useCallback(
    (id: UniqueIdentifier): string | undefined => {
      if (days.includes(id as string)) return id as string;
      return days.find((key) => daysTasks[key].includes(id as string));
    },
    [days, daysTasks],
  );

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const taskId = event.active.id as string;
      const day = findContainer(taskId);

      if (!day) {
        dragMetaRef.current = null;
        return;
      }

      dragMetaRef.current = {
        day,
        snapshot: cloneDaysTasks(daysTasks),
      };
    },
    [cloneDaysTasks, daysTasks, findContainer],
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

        const activeIndex = activeItems.indexOf(active.id as string);
        activeItems.splice(activeIndex, 1);

        let overIndex: number;
        if (over.id === overContainer) {
          overIndex = overItems.length;
        } else {
          const idx = overItems.indexOf(over.id as string);
          overIndex = idx >= 0 ? idx : overItems.length;
        }

        overItems.splice(overIndex, 0, active.id as string);

        return {
          ...prev,
          [activeContainer]: activeItems,
          [overContainer]: overItems,
        };
      });
    },
    [findContainer, setDaysTasks],
  );

  const handleDragCancel = useCallback(() => {
    const dragMeta = dragMetaRef.current;
    dragMetaRef.current = null;

    if (dragMeta) {
      setDaysTasks(dragMeta.snapshot);
    }
  }, [setDaysTasks]);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const dragMeta = dragMetaRef.current;
      dragMetaRef.current = null;

      if (!dragMeta) return;

      if (!over) {
        setDaysTasks(dragMeta.snapshot);
        return;
      }

      const activeContainer = findContainer(active.id);
      const overContainer = findContainer(over.id);
      if (!activeContainer || !overContainer) {
        setDaysTasks(dragMeta.snapshot);
        return;
      }

      let nextDaysTasks = daysTasks;

      const activeIndex = daysTasks[activeContainer].indexOf(
        active.id as string,
      );
      const overIndex =
        over.id === overContainer
          ? daysTasks[overContainer].length - 1
          : daysTasks[overContainer].indexOf(over.id as string);

      if (activeIndex !== overIndex && overIndex >= 0) {
        nextDaysTasks = {
          ...daysTasks,
          [activeContainer]: arrayMove(
            daysTasks[activeContainer],
            activeIndex,
            overIndex,
          ),
        };
        setDaysTasks(nextDaysTasks);
      }

      if (isSameLayout(dragMeta.snapshot, nextDaysTasks)) {
        return;
      }

      if (!onTasksCommit) {
        return;
      }

      void Promise.resolve(
        onTasksCommit({
          nextDaysTasks,
          previousDaysTasks: dragMeta.snapshot,
          sourceDay: dragMeta.day,
          targetDay: activeContainer,
        }),
      ).catch(() => {
        setDaysTasks(dragMeta.snapshot);
      });
    },
    [daysTasks, findContainer, isSameLayout, onTasksCommit, setDaysTasks],
  );

  return {
    sensors,
    handleDragStart,
    handleDragOver,
    handleDragCancel,
    handleDragEnd,
  };
};
