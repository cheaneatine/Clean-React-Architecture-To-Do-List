import { Task } from "../domain/entities/Task";

export interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

export const ADD_TASK = "ADD_TASK";
export const REMOVE_TASK = "REMOVE_TASK";
export const UPDATE_TASK = "UPDATE_TASK";
export const SET_TASKS = "SET_TASKS";
