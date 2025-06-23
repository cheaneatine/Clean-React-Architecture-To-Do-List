import type { TaskRepository } from "../domain/repository/TaskRepository";
import { Task } from "../domain/entities/Task";

export class GetTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Task | undefined> {
    return this.repository.getTask(id);
  }
}
