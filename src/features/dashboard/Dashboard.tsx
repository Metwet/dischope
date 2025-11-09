"use client";
import { useSetTasks, useTaskIds } from "@/entities/tasks/store/selectors";
import { getTestTasks } from "@/shared/api/dashboard-api";
import { useEffect } from "react";
import { useDays } from "./model/useDays";
import { useDnd } from "./model/useDnd";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { Box, FormGroup } from "@mui/material";
import { DayColumn } from "./ui/DayColumn";

export const Dashboard = () => {
  const taskIds = useTaskIds();
  const setTasks = useSetTasks();

  const { days, daysTasks, setDaysTasks, createDays } = useDays();

  const { sensors, handleDragOver, handleDragEnd } = useDnd({
    days,
    daysTasks,
    setDaysTasks,
  });

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
