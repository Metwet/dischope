"use client";

import {
  useSetTasks,
  useTaskIds,
  useTasksById,
  useUpdateTaskField,
} from "@/entities/tasks/store/selectors";
import { getTestTasks } from "@/shared/api/dashboard-api";
import { useUpdateEffect } from "@/shared/hooks/useUpdateEffect";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Box, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { TaskDay } from "./task-day/task-day";

export const Dashboard = () => {
  const taskIds = useTaskIds();
  const tasksById = useTasksById();
  const setTasks = useSetTasks();
  const updateTaskField = useUpdateTaskField();
  const [currentDays, setCurrentDays] = useState<ITaskDays | null>(null);

  const createDays = (tasks: number[]) => {
    if (tasks.length === 0) {
      setCurrentDays({});
      return;
    }

    const days: ITaskDays = {};

    const dates = tasks.map((id) =>
      new Date(tasksById[id].create_date).getTime()
    );
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dayStr = currentDate.toDateString();
      days[dayStr] = [];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    tasks.forEach((id) => {
      const date = new Date(tasksById[id].create_date);
      const day = date.toDateString();
      if (!!days[day]) {
        days[day].push(tasksById[id]);
      }
    });
    setCurrentDays(days);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over) {
      const date = new Date(over.id.toString());
      updateTaskField(Number(active.id), "create_date", date.toISOString());
    }
  };

  useEffect(() => {
    if (!taskIds.length) {
      getTestTasks().then((data) => {
        setTasks(data);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useUpdateEffect(() => {
    createDays(taskIds);
  }, [tasksById]);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <FormGroup>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          {currentDays &&
            Object.keys(currentDays)
              .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
              .map((day, index) => (
                <Box
                  key={index}
                  sx={{ width: "calc(100% / 7 - 16px)", minWidth: "180px" }}
                >
                  <TaskDay day={day} taskList={currentDays[day]} />
                </Box>
              ))}
        </Box>
      </FormGroup>
    </DndContext>
  );
};
