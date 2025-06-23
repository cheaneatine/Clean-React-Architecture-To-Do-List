import { Task } from "../domain/entities/Task";
import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, SET_TASKS } from "./task.types";

export const addTask = (task: Task) => ({
  type: ADD_TASK,
  payload: task,
});

export const removeTask = (id: string) => ({
  type: REMOVE_TASK,
  payload: id,
});

export const updateTask = (task: Task) => ({
  type: UPDATE_TASK,
  payload: task,
});

export const setTasks = (tasks: Task[]) => ({
  type: SET_TASKS,
  payload: tasks,
});
