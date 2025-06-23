import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Task } from "../domain/entities/Task";

interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks(state, action: PayloadAction<Task[]>) {
      state.tasks = action.payload;
    },
    addTask(state, action: PayloadAction<Task>) {
      state.tasks.push(action.payload);
    },
    removeTask(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((t) => t.id !== action.payload);
    },
    updateTask(state, action: PayloadAction<Task>) {
      const idx = state.tasks.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.tasks[idx] = action.payload;
    },
  },
});

export const { setTasks, addTask, removeTask, updateTask } = taskSlice.actions;
export default taskSlice.reducer;
