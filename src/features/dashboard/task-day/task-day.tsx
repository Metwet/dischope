import { Draggable } from "@/shared/dnd/draggable/draggable";
import { Droppable } from "@/shared/dnd/droppable/droppable";
import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { ChangeEvent, FC, SyntheticEvent } from "react";
import { TaskInput } from "../task-input/task-input";
import {
  useToggleTaskDone,
  useUpdateTaskText,
} from "@/entities/tasks/store/selectors";

interface ITaskDayProps {
  day: string;
  taskList: Array<ITask>;
}

export const TaskDay: FC<ITaskDayProps> = ({ day, taskList }) => {
  const toggleTaskDone = useToggleTaskDone();
  const updateTaskText = useUpdateTaskText();

  const handleCheck = (checkedTask: ITask, checked: boolean) => {
    toggleTaskDone(checkedTask.id, checked);
  };

  const handleInputChange = (event: ChangeEvent, changedTask: ITask) => {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;
    updateTaskText(changedTask.id, value);
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
                        value={task.text}
                        handleInputChange={(event: ChangeEvent) =>
                          handleInputChange(event, task)
                        }
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
