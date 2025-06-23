import type { TaskState } from "./task.types";
import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, SET_TASKS } from "./task.types";

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

export const taskReducer = (state = initialState, action: any): TaskState => {
  switch (action.type) {
    case ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };
    case REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload),
      };
    case UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case SET_TASKS:
      return { ...state, tasks: action.payload };
    default:
      return state;
  }
};
