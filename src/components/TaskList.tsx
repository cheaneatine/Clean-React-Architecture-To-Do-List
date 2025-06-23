import React from "react";
import { useDispatch } from "react-redux";
import { Task } from "../domain/entities/Task";
import { removeTask, updateTask, setTasks } from "../redux/task.slice";
import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";

interface Props {
  tasks: Task[];
  editingId: string | null;
  editingTitle: string;
  setEditingId: (id: string | null) => void;
  setEditingTitle: (title: string) => void;
}

const TaskList: React.FC<Props> = ({
  tasks,
  editingId,
  editingTitle,
  setEditingId,
  setEditingTitle,
}) => {
  const dispatch = useDispatch();

  const handleToggleComplete = (task: Task) => {
    dispatch(updateTask(new Task(task.id, task.title, !task.completed)));
  };

  const handleEditSubmit = (task: Task) => {
    if (editingTitle.trim()) {
      dispatch(updateTask(new Task(task.id, editingTitle, task.completed)));
    }
    setEditingId(null);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = [...tasks];
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    dispatch(setTasks(reordered));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasklist">
        {(provided) => (
          <ul ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable draggableId={task.id} index={index} key={task.id}>
                {(provided) => (
                  <li
                    className="task-item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div className="task-left" {...provided.dragHandleProps}>
                      <span>☰</span>
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggleComplete(task)}
                      />
                      {editingId === task.id ? (
                        <input
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onBlur={() => handleEditSubmit(task)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleEditSubmit(task)
                          }
                          autoFocus
                        />
                      ) : (
                        <span
                          className={task.completed ? "completed" : ""}
                          onDoubleClick={() => {
                            setEditingId(task.id);
                            setEditingTitle(task.title);
                          }}
                        >
                          {task.title}
                        </span>
                      )}
                    </div>
                    <button
                      className="task-delete"
                      onClick={() => dispatch(removeTask(task.id))}
                    >
                      ✕
                    </button>
                  </li>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;
