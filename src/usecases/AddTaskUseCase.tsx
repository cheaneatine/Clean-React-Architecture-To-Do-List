import type { TaskRepository } from "../domain/repository/TaskRepository";
import { Task } from "../domain/entities/Task";

export class AddTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(task: Task): Promise<void> {
    return this.repository.addTask(task);
  }
}
