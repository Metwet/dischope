"use client";

import { getTestTasks } from "@/shared/api/dashboard-api";
import { useUpdateEffect } from "@/shared/hooks/useUpdateEffect";
import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Box, FormGroup } from "@mui/material";
import { useEffect, useState } from "react";
import styles from "./dashboard.module.css";
import TaskDay from "./task-day/task-day";

const Dashboard = () => {
  const [currentTodoList, setCurrentTodoList] = useState<Array<ITask>>([]);
  const [currentDays, setCurrentDays] = useState<ITaskDays | null>(null);

  const createDays = (tasks: Array<ITask>) => {
    if (tasks.length === 0) {
      setCurrentDays({});
      return;
    }

    const days: ITaskDays = {};

    const dates = tasks.map((task) => new Date(task.create_date).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    const currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const dayStr = currentDate.toDateString();
      days[dayStr] = [];
      currentDate.setDate(currentDate.getDate() + 1);
    }

    tasks.forEach((task) => {
      const date = new Date(task.create_date);
      const day = date.toDateString();
      if (!!days[day]) {
        days[day].push(task);
      }
    });
    setCurrentDays(days);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    let needToCange: boolean = false;
    const items = currentTodoList.map((task) => {
      if (task.id === Number(active.id) && !!over) {
        const date = new Date(over.id);
        task.create_date = date.toISOString();
        needToCange = true;
      }
      return task;
    });
    if (needToCange) {
      setCurrentTodoList(items);
    }
  };

  useEffect(() => {
    getTestTasks().then((data) => {
      setCurrentTodoList(data);
    });
  }, []);

  useUpdateEffect(() => {
    createDays(currentTodoList);
  }, [currentTodoList]);

  return (
    <Box className={styles.todolist}>
      <DndContext onDragEnd={handleDragEnd}>
        <FormGroup>
          <Box>
            {currentDays &&
              Object.keys(currentDays)
                .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
                .map((day, index) => (
                  <TaskDay
                    key={index}
                    day={day}
                    taskList={currentDays[day]}
                    currentTodoList={currentTodoList}
                    setCurrentTodoList={setCurrentTodoList}
                  />
                ))}
          </Box>
        </FormGroup>
      </DndContext>
    </Box>
  );
};

export default Dashboard;
