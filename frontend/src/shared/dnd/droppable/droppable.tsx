import { useDroppable } from "@dnd-kit/core";
import { FC, ReactNode } from "react";

interface IDroppableProps {
  children: ReactNode;
  id: string;
}

export const Droppable: FC<IDroppableProps> = ({ children, id }) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  const style = {
    color: isOver ? "green" : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};
