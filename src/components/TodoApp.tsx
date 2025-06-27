import React, { useEffect, useState } from "react";
import { useTaskUseCase } from "../usecases/UseTaskUseCase";
import { useThemeUseCase } from "../hooks/useThemeCases";
import { useDarkMode } from "../hooks/useDarkMode";
import { Sun, Moon } from "lucide-react";
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

  // Theme
  const { isColorLight, applyThemeColor, loadThemeColor } = useThemeUseCase();
  const [darkMode, setDarkMode] = useDarkMode();
  const [customColor, setCustomColor] = useState(loadThemeColor());
  const [isLightColor, setIsLightColor] = useState(false);

  // Task Input
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");

  // Task Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDueDate, setEditingDueDate] = useState("");

  // Filtering
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

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

  useEffect(() => {
    applyThemeColor(customColor);
    setIsLightColor(isColorLight(customColor));
  }, [customColor]);

  const filteredTasks = getFilteredTasks(filter);

  const addTaskAndReset = () => {
    handleAddTask(title, dueDate);
    setTitle("");
    setDueDate("");
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, task: any) => {
    if (e.key === "Enter") {
      const trimmed = editingTitle.trim();
      if (
        trimmed &&
        (trimmed !== task.title || editingDueDate !== task.dueDate)
      ) {
        handleEditTask(task, trimmed, editingDueDate);
      }
      setEditingId(null);
      setEditingTitle("");
      setEditingDueDate("");
    }
    if (e.key === "Escape") {
      setEditingId(null);
      setEditingTitle("");
      setEditingDueDate("");
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="body-wrapper">
        <div className="todo-container">
          <div className="todo-header">
            <h1>To Do List</h1>
            <div
              style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
            >
              <button
                className="theme-toggle-btn"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? (
                  <Sun className="theme-icon" />
                ) : (
                  <Moon className="theme-icon" />
                )}
              </button>
              <div className="color-picker-wrapper">
                <label
                  htmlFor="theme-color"
                  className="color-swatch"
                  style={{ backgroundColor: customColor }}
                />
                <input
                  id="theme-color"
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="color-picker-input"
                  title="Pick a theme color"
                />
              </div>
            </div>
          </div>

          <div className="input-row">
            <input
              className="todo-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTaskAndReset();
                }
              }}
              placeholder="Add new task..."
            />
            <input
              type="date"
              className="todo-input"
              value={dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDueDate(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault(); // stop calendar popup
                  addTaskAndReset();
                }
              }}
            />
            <button className="todo-button" onClick={addTaskAndReset}>
              Add
            </button>
          </div>

          <div className="todo-stats">
            <div className="todo-stats-values">
              <div>
                <p className="stat-number">{allTasks.length}</p>
                <p className="stat-label">Total</p>
              </div>
              <div>
                <p className="stat-number">
                  {allTasks.filter((t) => !t.completed).length}
                </p>
                <p className="stat-label">Active</p>
              </div>
              <div>
                <p className="stat-number">
                  {allTasks.filter((t) => t.completed).length}
                </p>
                <p className="stat-label">Completed</p>
              </div>
            </div>
            <div className="todo-filters">
              {["all", "active", "completed"].map((f) => (
                <button
                  key={f}
                  className={`todo-filter-btn ${filter === f ? "active" : ""} ${
                    filter === f && isLightColor ? "light-active" : ""
                  }`}
                  onClick={() => setFilter(f as any)}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="task-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className="task-item">
                <div className="task-left">
                  {editingId !== task.id && (
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                    />
                  )}
                  {editingId === task.id ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        flex: 1,
                      }}
                    >
                      <input
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, task)}
                        className="todo-input"
                        autoFocus
                      />
                      <input
                        type="date"
                        value={editingDueDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setEditingDueDate(e.target.value)}
                        onKeyDown={(e) => handleEditKeyDown(e, task)}
                        className="todo-input"
                      />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="todo-button"
                          onClick={() => {
                            const trimmed = editingTitle.trim();
                            if (
                              trimmed &&
                              (trimmed !== task.title ||
                                editingDueDate !== task.dueDate)
                            ) {
                              handleEditTask(task, trimmed, editingDueDate);
                            }
                            setEditingId(null);
                            setEditingTitle("");
                            setEditingDueDate("");
                          }}
                        >
                          Save
                        </button>
                        <button
                          className="task-delete"
                          onClick={() => {
                            setEditingId(null);
                            setEditingTitle("");
                            setEditingDueDate("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() => {
                        setEditingId(task.id);
                        setEditingTitle(task.title);
                        setEditingDueDate(task.dueDate || "");
                      }}
                      style={{
                        flex: 1,
                        cursor: "text",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <span className={task.completed ? "completed" : ""}>
                        {task.title}
                      </span>
                      {task.dueDate && (
                        <small className="due-date">
                          Due:{" "}
                          {new Date(task.dueDate).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </small>
                      )}
                    </div>
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
