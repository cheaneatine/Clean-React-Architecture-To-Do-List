import type { TaskRepository } from "../domain/repository/TaskRepository";
import { Task } from "../domain/entities/Task";

export class UpdateTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(task: Task): Promise<void> {
    return this.repository.updateTask(task);
  }
}
