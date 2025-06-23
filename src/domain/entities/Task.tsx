export class Task {
  public id: string;
  public title: string;
  public completed: boolean;

  constructor(id: string, title: string, completed: boolean = false) {
    this.id = id;
    this.title = title;
    this.completed = completed;
  }
}
