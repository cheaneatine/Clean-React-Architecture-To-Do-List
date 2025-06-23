import type { TaskRepository } from "../domain/repository/TaskRepository";

export class RemoveTaskUseCase {
  private repository: TaskRepository;

  constructor(repository: TaskRepository) {
    this.repository = repository;
  }

  async execute(id: string): Promise<void> {
    return this.repository.removeTask(id);
  }
}
