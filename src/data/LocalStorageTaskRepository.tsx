import { Task } from "../domain/entities/Task";
import type { TaskRepository } from "../domain/repository/TaskRepository";

export class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = "tasks";

  async addTask(task: Task): Promise<void> {
    const tasks = await this.getAllTasks();
    tasks.push(task);
    await this.setAllTasks(tasks);
  }

  async removeTask(id: string): Promise<void> {
    const tasks = await this.getAllTasks();
    const updated = tasks.filter((t) => t.id !== id);
    await this.setAllTasks(updated);
  }

  async updateTask(updatedTask: Task): Promise<void> {
    const tasks = await this.getAllTasks();
    const updated = tasks.map((t) =>
      t.id === updatedTask.id ? updatedTask : t
    );
    await this.setAllTasks(updated);
  }

  async getAllTasks(): Promise<Task[]> {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  async getTask(id: string): Promise<Task | undefined> {
    const tasks = await this.getAllTasks();
    return tasks.find((t) => t.id === id);
  }

  async setAllTasks(tasks: Task[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
  }
}
