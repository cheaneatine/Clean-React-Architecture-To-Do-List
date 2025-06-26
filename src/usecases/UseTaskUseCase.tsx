import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { useCallback } from "react";
import { Task } from "../domain/entities/Task";
import { taskRepository } from "../repositoryFactory";
import { setTasks } from "../redux/task.slice";
import type { RootState } from "../redux/store";
import { showLimitedToast } from "../utilities/toastManager";
import { launchConfetti } from "../utilities/confetti";

export const useTaskUseCase = () => {
  const dispatch = useDispatch();
  const allTasks = useSelector((state: RootState) => state.taskState.tasks);

  const loadTasks = useCallback(async () => {
    const tasks = await taskRepository.getAllTasks();
    dispatch(setTasks(tasks));
  }, [dispatch]);

  const handleAddTask = async (title: string): Promise<string | null> => {
    const trimmed = title.trim();
    if (!trimmed) {
      showLimitedToast("Task title cannot be empty", "error");
      return "empty";
    }

    const duplicate = allTasks.find(
      (task) => task.title.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      showLimitedToast("Task already exists", "error");
      return "duplicate";
    }

    const newTask: Task = { id: uuidv4(), title: trimmed, completed: false };
    await taskRepository.addTask(newTask);
    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));
    showLimitedToast("Task added", "success");
    return null;
  };

  const handleEditTask = async (
    task: Task,
    newTitle: string
  ): Promise<void> => {
    const trimmed = newTitle.trim();
    if (!trimmed) {
      showLimitedToast("Task title cannot be empty", "error");
      return;
    }

    await taskRepository.updateTask({ ...task, title: trimmed });
    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));
    showLimitedToast("Task edited", "success");
  };

  const handleToggleComplete = async (task: Task): Promise<void> => {
    const updatedTask = { ...task, completed: !task.completed };
    await taskRepository.updateTask(updatedTask);

    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));

    showLimitedToast(
      updatedTask.completed ? "Task completed" : "Task marked incomplete",
      updatedTask.completed ? "success" : "error"
    );

    // Trigger confetti if all tasks are completed
    const allCompleted =
      updated.length > 0 && updated.every((t) => t.completed);
    if (allCompleted) {
      launchConfetti();
      showLimitedToast("🎉 All tasks completed!", "success");
    }
  };

  const handleRemoveTask = async (task: Task): Promise<void> => {
    if (!task.completed) {
      showLimitedToast("You can only delete completed tasks", "error");
      return;
    }

    await taskRepository.removeTask(task.id);
    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));
    showLimitedToast("Task deleted", "success");
  };

  const handleRemoveCompleted = async (): Promise<void> => {
    const completed = allTasks.filter((t) => t.completed);
    if (completed.length === 0) {
      showLimitedToast("No completed tasks to remove");
      return;
    }

    for (const task of completed) {
      await taskRepository.removeTask(task.id);
    }
    const updated = await taskRepository.getAllTasks();
    dispatch(setTasks(updated));
    showLimitedToast("Completed tasks removed", "success");
  };

  const getFilteredTasks = (filter: "all" | "active" | "completed"): Task[] => {
    return allTasks.filter((task) =>
      filter === "active"
        ? !task.completed
        : filter === "completed"
        ? task.completed
        : true
    );
  };

  return {
    allTasks,
    loadTasks,
    handleAddTask,
    handleEditTask,
    handleToggleComplete,
    handleRemoveTask,
    handleRemoveCompleted,
    getFilteredTasks,
  };
};
