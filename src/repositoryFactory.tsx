import type { TaskRepository } from "./domain/repository/TaskRepository";
import { LocalStorageTaskRepository } from "./data/LocalStorageTaskRepository";

export const taskRepository: TaskRepository = new LocalStorageTaskRepository();
