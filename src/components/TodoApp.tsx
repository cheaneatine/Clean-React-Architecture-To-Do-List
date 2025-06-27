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

  const theme = useThemeUseCase();
  const [darkMode, setDarkMode] = useDarkMode();

  const [state, setState] = useState({
    title: "",
    dueDate: "",
    editingId: null as string | null,
    editingTitle: "",
    editingDueDate: "",
    filter: "all" as "all" | "active" | "completed",
    customColor: theme.loadThemeColor(),
    isLightColor: false,
  });

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
    theme.applyThemeColor(state.customColor);
    setState((prev) => ({
      ...prev,
      isLightColor: theme.isColorLight(state.customColor),
    }));
  }, [state.customColor]);

  const filteredTasks = getFilteredTasks(state.filter);

  const resetInputs = () =>
    setState((prev) => ({ ...prev, title: "", dueDate: "" }));
  const cancelEdit = () =>
    setState((prev) => ({
      ...prev,
      editingId: null,
      editingTitle: "",
      editingDueDate: "",
    }));

  const addTaskAndReset = () => {
    handleAddTask(state.title, state.dueDate);
    resetInputs();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, task: any) => {
    if (e.key === "Enter") {
      const trimmed = state.editingTitle.trim();
      if (
        trimmed &&
        (trimmed !== task.title || state.editingDueDate !== task.dueDate)
      ) {
        handleEditTask(task, trimmed, state.editingDueDate);
      }
      cancelEdit();
    } else if (e.key === "Escape") {
      cancelEdit();
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
                  style={{ backgroundColor: state.customColor }}
                />
                <input
                  id="theme-color"
                  type="color"
                  value={state.customColor}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      customColor: e.target.value,
                    }))
                  }
                  className="color-picker-input"
                  title="Pick a theme color"
                />
              </div>
            </div>
          </div>

          <div className="input-row">
            <input
              className="todo-input"
              value={state.title}
              onChange={(e) =>
                setState((prev) => ({ ...prev, title: e.target.value }))
              }
              onKeyDown={(e) => e.key === "Enter" && addTaskAndReset()}
              placeholder="Add new task..."
            />
            <input
              type="date"
              className="todo-input"
              value={state.dueDate}
              onChange={(e) =>
                setState((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
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
                  className={`todo-filter-btn ${
                    state.filter === f ? "active" : ""
                  } ${
                    state.filter === f && state.isLightColor
                      ? "light-active"
                      : ""
                  }`}
                  onClick={() =>
                    setState((prev) => ({ ...prev, filter: f as any }))
                  }
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
                  {state.editingId !== task.id && (
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleComplete(task)}
                    />
                  )}
                  {state.editingId === task.id ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.25rem",
                        flex: 1,
                      }}
                    >
                      <input
                        value={state.editingTitle}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            editingTitle: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => handleEditKeyDown(e, task)}
                        className="todo-input"
                        autoFocus
                      />
                      <input
                        type="date"
                        value={state.editingDueDate}
                        onChange={(e) =>
                          setState((prev) => ({
                            ...prev,
                            editingDueDate: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => handleEditKeyDown(e, task)}
                        className="todo-input"
                      />
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="todo-button"
                          onClick={() => {
                            const trimmed = state.editingTitle.trim();
                            if (
                              trimmed &&
                              (trimmed !== task.title ||
                                state.editingDueDate !== task.dueDate)
                            ) {
                              handleEditTask(
                                task,
                                trimmed,
                                state.editingDueDate
                              );
                            }
                            cancelEdit();
                          }}
                        >
                          Save
                        </button>
                        <button className="task-delete" onClick={cancelEdit}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onDoubleClick={() =>
                        setState((prev) => ({
                          ...prev,
                          editingId: task.id,
                          editingTitle: task.title,
                          editingDueDate: task.dueDate || "",
                        }))
                      }
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
