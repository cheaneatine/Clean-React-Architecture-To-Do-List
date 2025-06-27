export class Task {
  public id: string;
  public title: string;
  public completed: boolean;
  public dueDate?: string; // Optional

  constructor(
    id: string,
    title: string,
    completed: boolean = false,
    dueDate?: string
  ) {
    this.id = id;
    this.title = title;
    this.completed = completed;
    this.dueDate = dueDate;
  }
}
