import { createReducer } from "redux-starter-kit";
import {
  SUBMIT_TASK,
  SUBMIT_TASK_ERROR,
  SUBMITTED_TASK,
  POLL_TASK,
  POLLED_TASK,
  UPDATE_TASK,
  TaskRootState,
  TaskState,
  UpdateTaskAction,
  SubmitTaskErrorAction
} from "./types";

const initalState: TaskRootState = {
  error: null,
  state: TaskState.INITIAL,
  currentTask: null
};

export const taskReducer = createReducer(initalState, {
  [UPDATE_TASK]: (state, action) => {
    state.currentTask = action.payload;
  },
  [SUBMIT_TASK]: state => {
    state.error = null;
    state.state = TaskState.SUBMITTING;
  },
  [SUBMIT_TASK_ERROR]: (state, action) => {
    state.state = TaskState.SUBMIT_ERROR;
    state.error = action.payload;
  },
  [SUBMITTED_TASK]: state => {
    state.state = TaskState.INITIAL;
  },
  [POLL_TASK]: state => {
    state.state = TaskState.POLLING;
  },
  [POLLED_TASK]: state => {
    state.state = TaskState.INITIAL;
  }
});
