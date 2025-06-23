import { Task } from "../entities/Task";

export interface TaskRepository {
  addTask(task: Task): Promise<void>;
  removeTask(id: string): Promise<void>;
  updateTask(task: Task): Promise<void>;
  getAllTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  setAllTasks?(tasks: Task[]): Promise<void>;
}
