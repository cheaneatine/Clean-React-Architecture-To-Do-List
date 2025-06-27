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

  const syncTasks = async () => {
    const tasks = await taskRepository.getAllTasks();
    dispatch(setTasks(tasks));
    return tasks;
  };

  const loadTasks = useCallback(syncTasks, [dispatch]);

  const handleAddTask = async (
    title: string,
    dueDate?: string
  ): Promise<string | null> => {
    const trimmed = title.trim();
    if (!trimmed)
      return showLimitedToast("Task title cannot be empty", "error"), "empty";

    const duplicate = allTasks.find(
      (task) => task.title.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate)
      return showLimitedToast("Task already exists", "error"), "duplicate";

    const newTask: Task = {
      id: uuidv4(),
      title: trimmed,
      completed: false,
      dueDate,
    };
    await taskRepository.addTask(newTask);
    await syncTasks();
    showLimitedToast("Task added", "success");
    return null;
  };

  const handleEditTask = async (
    task: Task,
    newTitle: string,
    newDueDate?: string
  ): Promise<void> => {
    const trimmed = newTitle.trim();
    if (!trimmed)
      return showLimitedToast("Task title cannot be empty", "error");

    const updatedTask = {
      ...task,
      title: trimmed,
      dueDate: newDueDate ?? task.dueDate,
    };
    await taskRepository.updateTask(updatedTask);
    await syncTasks();
    showLimitedToast("Task updated", "success");
  };

  const handleToggleComplete = async (task: Task): Promise<void> => {
    const updatedTask = { ...task, completed: !task.completed };
    await taskRepository.updateTask(updatedTask);

    const updated = await syncTasks();
    showLimitedToast(
      updatedTask.completed ? "Task completed" : "Task marked incomplete",
      updatedTask.completed ? "success" : "error"
    );

    const allCompleted =
      updated.length > 0 && updated.every((t) => t.completed);
    if (allCompleted) {
      launchConfetti();
      showLimitedToast("🎉 All tasks completed!", "success");
    }
  };

  const handleRemoveTask = async (task: Task): Promise<void> => {
    if (!task.completed)
      return showLimitedToast("You can only delete completed tasks", "error");

    await taskRepository.removeTask(task.id);
    await syncTasks();
    showLimitedToast("Task deleted", "success");
  };

  const handleRemoveCompleted = async (): Promise<void> => {
    const completed = allTasks.filter((t) => t.completed);
    if (completed.length === 0)
      return showLimitedToast("No completed tasks to remove");

    await Promise.all(
      completed.map((task) => taskRepository.removeTask(task.id))
    );
    await syncTasks();
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
