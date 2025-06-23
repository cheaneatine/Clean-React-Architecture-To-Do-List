import { Task } from "../domain/entities/Task";
import type { TaskRepository } from "../domain/repository/TaskRepository";

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async addTask(task: Task): Promise<void> {
    this.tasks.push(task);
  }

  async removeTask(id: string): Promise<void> {
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  async updateTask(updatedTask: Task): Promise<void> {
    this.tasks = this.tasks.map((task) =>
      task.id === updatedTask.id ? updatedTask : task
    );
  }

  async getAllTasks(): Promise<Task[]> {
    return [...this.tasks];
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.find((task) => task.id === id);
  }
}
