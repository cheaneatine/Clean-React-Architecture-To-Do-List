import React, { useEffect, useState } from "react";
import { useTaskUseCase } from "../usecases/UseTaskUseCase";
import { useDarkMode } from "../hooks/useDarkMode";
import "../styles/todo.css";

const TodoApp: React.FC = () => {
  const {
    allTasks,
    loadTasks,
    handleAddTask,
    handleEditTask,
    handleToggleComplete,
    handleRemoveTask,
    handleRemoveCompleted,
    getFilteredTasks,
  } = useTaskUseCase();

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useDarkMode();

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Delete") {
        handleRemoveCompleted();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleRemoveCompleted]);

  const filteredTasks = getFilteredTasks(filter);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="body-wrapper">
        <div className="todo-container">
          {/* Header */}
          <div className="todo-header">
            <h1>Todo App</h1>
            <button
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              <span
                style={{
                  display: "inline-block",
                  transition: "transform 0.3s ease",
                  transform: darkMode ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                {darkMode ? "🌞" : "🌙"}
              </span>
            </button>
          </div>

          {/* Input */}
          <div className="input-row">
            <input
              className="todo-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTask(title);
                  setTitle("");
                }
              }}
              placeholder="Add new task..."
            />
            <button
              className="todo-button"
              onClick={() => {
                handleAddTask(title);
                setTitle("");
              }}
            >
              Add
            </button>
          </div>

          {/* Stats */}
          <div className="todo-stats">
            <div className="todo-stats-values">
              <div>
                <p>{allTasks.length}</p>
                <p>Total</p>
              </div>
              <div>
                <p>{allTasks.filter((t) => !t.completed).length}</p>
                <p>Active</p>
              </div>
              <div>
                <p>{allTasks.filter((t) => t.completed).length}</p>
                <p>Completed</p>
              </div>
            </div>

            {/* Filters */}
            <div className="todo-filters">
              {["all", "active", "completed"].map((f) => (
                <button
                  key={f}
                  className={`todo-filter-btn ${filter === f ? "active" : ""}`}
                  onClick={() => setFilter(f as any)}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div>
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(task)}
                  />
                  {editingId === task.id ? (
                    <input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onBlur={() => {
                        handleEditTask(task, editingTitle);
                        setEditingId(null);
                        setEditingTitle("");
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleEditTask(task, editingTitle);
                          setEditingId(null);
                          setEditingTitle("");
                        }
                        if (e.key === "Escape") {
                          setEditingId(null);
                          setEditingTitle("");
                        }
                      }}
                      autoFocus
                      className="todo-input"
                    />
                  ) : (
                    <span
                      onDoubleClick={() => {
                        setEditingId(task.id);
                        setEditingTitle(task.title);
                      }}
                      style={{ flex: 1, cursor: "text" }}
                      className={task.completed ? "completed" : ""}
                    >
                      {task.title}
                    </span>
                  )}
                </div>
                <button
                  className="task-delete"
                  onClick={() => handleRemoveTask(task)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <p className="todo-footer">
            Press Enter to add • Double-click to edit • Ctrl+Delete to remove
            completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
