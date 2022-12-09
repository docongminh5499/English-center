import { createStyles, Text } from "@mantine/core";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Lecture from "../../../../models/lecture.model";
import Button from "../../../commons/Button";


const useStyles = createStyles((theme) => ({
  item: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `1px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
      }`,
    padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
    paddingLeft: theme.spacing.xl - theme.spacing.md, // to offset drag handle
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },
  itemActive: {
    color: theme.colors.gray[0],
    fontWeight: 600,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.blue[5],
  },
  itemDragging: {
    boxShadow: theme.shadows.sm,
  },
}));

interface DndListHandleProps {
  data: Lecture[];
  activeId?: string;
  onDragItem: (from: number, to: number) => void;
  onClickItem: (lecture: Lecture) => void;
  onDeleteItem: (lecture: Lecture) => void;
}

export function LectureList({ data, onDragItem, activeId, onClickItem, onDeleteItem }: DndListHandleProps) {
  const { classes, cx } = useStyles();

  const items = data.map((item, index) => (
    <Draggable key={item.pseudoId} index={index} draggableId={item.pseudoId}>
      {(provided, snapshot) => (
        <div
          onClick={() => onClickItem(item)}
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
            [classes.itemActive]: activeId === item.pseudoId
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Text style={{ flex: 1 }}>{item.name}</Text>
          <Button
            onClick={(e?: any) => {
              e?.stopPropagation()
              onDeleteItem(item);
            }}
            color={item.pseudoId === activeId ? "blue" : "red"}
            variant={item.pseudoId === activeId ? "white" : "outline"}>
            Xóa
          </Button>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext onDragEnd={({ destination, source }) => onDragItem(source.index, destination?.index || 0)}>
      <Droppable droppableId="dnd-list" direction="vertical">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}