import { Draggable } from "@/shared/dnd/draggable/draggable";
import { Droppable } from "@/shared/dnd/droppable/droppable";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { FC, SyntheticEvent } from "react";
import { TaskInput } from "../task-input/task-input";
import { useUpdateTaskField } from "@/entities/tasks/store/selectors";

interface ITaskDayProps {
  day: string;
  taskList: Array<ITask>;
}

export const TaskDay: FC<ITaskDayProps> = ({ day, taskList }) => {
  const updateTaskField = useUpdateTaskField();

  const handleCheck = (checkedTask: ITask, checked: boolean) => {
    updateTaskField(checkedTask.id, "done", checked);
  };

  return (
    <Droppable id={day}>
      <Typography>{day}</Typography>
      {!!taskList.length
        ? taskList.map((task) => (
            <Draggable key={task.id} id={task.id.toString()}>
              <Box sx={{ p: "2px", fontSize: "20px" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={
                    <Box>
                      <TaskInput
                        id={task.id}
                        value={task.text}
                        lineThrough={task.done}
                      />
                    </Box>
                  }
                  checked={task.done}
                  onChange={(
                    event: SyntheticEvent<Element, Event>,
                    checked: boolean
                  ) => handleCheck(task, checked)}
                />
              </Box>
            </Draggable>
          ))
        : "task-list is empty"}
    </Droppable>
  );
};
