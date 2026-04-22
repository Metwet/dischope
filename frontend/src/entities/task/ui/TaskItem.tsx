/**
 * @description Карточка задачи с поддержкой drag-and-drop, чекбоксом и редактируемым текстом.
 */
"use client";

import { useTaskById, useUpdateTaskField } from "../model/selectors";
import { updateTask } from "../api/taskApi";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Checkbox, FormControlLabel, Paper } from "@mui/material";
import { SyntheticEvent } from "react";
import { TaskInput } from "./TaskInput";
import { DragIndicator } from "@mui/icons-material";

interface TaskItemProps {
  id: string;
}

export const TaskItem = ({ id }: TaskItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const task = useTaskById(id);
  const updateTaskField = useUpdateTaskField();

  const handleCheck = (checkedTask: ITask, checked: boolean) => {
    updateTaskField(checkedTask.id, "completed", checked);
    void updateTask(checkedTask.id, { completed: checked }).catch(() => {
      updateTaskField(checkedTask.id, "completed", checkedTask.completed);
    });
  };

  if (!task) {
    return null;
  }

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
      }}
    >
      <FormControlLabel
        control={<Checkbox />}
        label={
          <Box>
            <TaskInput
              id={task.id}
              value={task.title}
              lineThrough={task.completed}
            />
          </Box>
        }
        checked={task.completed}
        onChange={(_event: SyntheticEvent<Element, Event>, checked: boolean) =>
          handleCheck(task, checked)
        }
      />
      <Box
        {...attributes}
        {...listeners}
        sx={{
          cursor: transform ? "grabbing" : "grab",
        }}
      >
        <DragIndicator />
      </Box>
    </Paper>
  );
};
