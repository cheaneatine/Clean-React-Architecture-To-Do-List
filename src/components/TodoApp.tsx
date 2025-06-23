import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { setTasks } from "../redux/task.slice";
import { Task } from "../domain/entities/Task";
import { v4 as uuidv4 } from "uuid";
import { useDarkMode } from "../hooks/useDarkMode";
import { taskRepository } from "../repositoryFactory";
import "../styles/todo.css";

const TodoApp: React.FC = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state: RootState) => state.taskState.tasks);

  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [darkMode, setDarkMode] = useDarkMode();

  // Load tasks once on mount from repository
  useEffect(() => {
    const loadTasks = async () => {
      const saved = await taskRepository.getAllTasks();
      dispatch(setTasks(saved));
    };
    loadTasks();
  }, [dispatch]);

  // Add task
  const handleAddTask = async () => {
    if (title.trim()) {
      const newTask: Task = {
        id: uuidv4(),
        title: title.trim(),
        completed: false,
      };
      await taskRepository.addTask(newTask); // persist
      const updated = await taskRepository.getAllTasks(); // sync
      dispatch(setTasks(updated)); // update Redux
      setTitle("");
    }
  };

  // Toggle complete
  const handleToggleComplete = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };
    await taskRepository.updateTask(updatedTask);
    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));
  };

  // Submit edit
  const handleEditSubmit = async (task: Task) => {
    if (editingTitle.trim()) {
      const updatedTask = { ...task, title: editingTitle };
      await taskRepository.updateTask(updatedTask);
      const updated = await taskRepository.getAllTasks();
      dispatch(setTasks(updated));
    }
    setEditingId(null);
    setEditingTitle("");
  };

  // Remove one task
  const handleRemove = async (id: string) => {
    await taskRepository.removeTask(id);
    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));
  };

  // Ctrl+Delete to remove all completed
  useEffect(() => {
    const handler = async (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "Delete") {
        const remaining = allTasks.filter((t) => !t.completed);
        if (taskRepository.setAllTasks) {
          await taskRepository.setAllTasks(remaining);
          dispatch(setTasks(remaining));
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allTasks, dispatch]);

  const filteredTasks = allTasks.filter((task) =>
    filter === "active"
      ? !task.completed
      : filter === "completed"
      ? task.completed
      : true
  );

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="body-wrapper">
        <div className="todo-container">
          {/* Header */}
          <div className="todo-header">
            <h1>To Do List</h1>
            <button
              className="theme-toggle-btn"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? "🌞" : "🌙"}
            </button>
          </div>

          {/* Add Task */}
          <div className="input-row">
            <input
              className="todo-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
              placeholder="Add new task..."
            />
            <button className="todo-button" onClick={handleAddTask}>
              Add
            </button>
          </div>

          {/* Stats */}
          <div className="todo-stats">
            <div className="todo-stats-values">
              <div className="stat-block">
                <p className="stat-number">{allTasks.length}</p>
                <p className="stat-label">Total</p>
              </div>
              <div className="stat-block">
                <p className="stat-number">
                  {allTasks.filter((t) => !t.completed).length}
                </p>
                <p className="stat-label">Active</p>
              </div>
              <div className="stat-block">
                <p className="stat-number">
                  {allTasks.filter((t) => t.completed).length}
                </p>
                <p className="stat-label">Completed</p>
              </div>
            </div>

            {/* Filter Buttons */}
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
                      onBlur={() => handleEditSubmit(task)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSubmit(task);
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
                  onClick={() => handleRemove(task.id)}
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
