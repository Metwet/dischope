import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { ChangeEvent, FC, SyntheticEvent } from "react";
import Droppable from "../droppable/droppable";
import Draggable from "../draggable/draggable";
import styles from "../dashboard.module.css";
import TaskInput from "../task-input/task-input";

interface ITaskDayProps {
  day: string;
  taskList: Array<ITask>;
  currentTodoList: Array<ITask>;
  setCurrentTodoList: (currentTodoList: Array<ITask>) => void;
}

const TaskDay: FC<ITaskDayProps> = ({
  day,
  taskList,
  currentTodoList,
  setCurrentTodoList,
}) => {
  const handleCheck = (checkedTask: ITask, checked: boolean) => {
    const items = currentTodoList.map((task) => {
      if (task.id === checkedTask.id) {
        task.done = checked;
      }
      return task;
    });
    setCurrentTodoList(items);
  };

  const handleInputChange = (event: ChangeEvent, changedTask: ITask) => {
    const element = event.currentTarget as HTMLInputElement;
    const value = element.value;
    const items = currentTodoList.map((task) => {
      if (task.id === changedTask.id) {
        task.text = value;
      }
      return task;
    });
    setCurrentTodoList(items);
  };

  return (
    <Droppable id={day}>
      <Typography>{day}</Typography>
      {!!taskList.length
        ? taskList.map((task) => (
            <Draggable key={task.id} id={task.id.toString()}>
              <Box className={styles.task}>
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

export default TaskDay;
