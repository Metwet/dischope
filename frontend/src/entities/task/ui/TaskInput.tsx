/**
 * @description Текстовый инпут для редактирования задачи с debounce-сохранением в стор.
 */
import { useUpdateTaskField } from "../model/selectors";
import { updateTask } from "../api/taskApi";
import { Input } from "@mui/material";
import {
  ChangeEvent,
  FC,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

interface ITaskInputProps {
  id: string;
  value: string;
  lineThrough: boolean;
  fullWidth?: boolean;
  /** Enter без Shift: не вставлять перевод строки, сначала сохранить черновик, затем вызвать (только инлайн на дашборде). */
  onEnterWithoutShift?: () => void;
  /** Сфокусировать поле один раз (например, после вставки задачи снизу). */
  autoFocusTitle?: boolean;
  onAutoFocusConsumed?: () => void;
}

export const TaskInput: FC<ITaskInputProps> = ({
  id,
  value,
  lineThrough,
  fullWidth = false,
  onEnterWithoutShift,
  autoFocusTitle = false,
  onAutoFocusConsumed,
}) => {
  const updateTaskField = useUpdateTaskField();
  const [text, setText] = useState<string>(value);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const flushTitleToServer = (nextTitle: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }
    updateTaskField(id, "title", nextTitle);
    void updateTask(id, { title: nextTitle }).catch(() => {
      updateTaskField(id, "title", value);
      setText(value);
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      flushTitleToServer(newValue);
    }, 300);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!onEnterWithoutShift || e.key !== "Enter" || e.shiftKey) {
      return;
    }
    e.preventDefault();
    flushTitleToServer(text);
    onEnterWithoutShift();
  };

  useEffect(() => {
    setText(value);
  }, [value]);

  useLayoutEffect(() => {
    if (!autoFocusTitle) {
      return;
    }
    const el = inputRef.current;
    el?.focus();
    el?.select();
    onAutoFocusConsumed?.();
  }, [autoFocusTitle, onAutoFocusConsumed]);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <Input
      inputRef={inputRef}
      value={text}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      fullWidth={fullWidth}
      sx={{ textDecoration: lineThrough ? "line-through" : "none" }}
      disableUnderline
      multiline
    />
  );
};
