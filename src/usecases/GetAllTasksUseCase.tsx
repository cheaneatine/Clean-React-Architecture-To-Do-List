import type { TaskRepository } from "../domain/repository/TaskRepository";
import { Task } from "../domain/entities/Task";

export class GetAllTasksUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(): Promise<Task[]> {
    return this.repository.getAllTasks();
  }
}
