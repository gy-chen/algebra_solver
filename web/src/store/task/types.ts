import { History } from "history";
import * as apiTask from "../../api/task";

export const SUBMIT_TASK = "SUBMIT_TASK";
export const SUBMIT_TASK_ERROR = "SUBMIT_TASK_ERROR";
export const SUBMITTED_TASK = "SUBMITTED_TASK";
export const POLL_TASK = "POLL_TASK";
export const POLLED_TASK = "POLLED_TASK";
export const UPDATE_TASK = "UPDATE_TASK";

export interface TaskRootState {
  error: TaskContentError | null;
  state: TaskState;
  currentTask: Task | null;
}

export enum TaskState {
  INITIAL,
  SUBMITTING,
  SUBMIT_ERROR,
  POLLING
}

export interface SubmitTaskAction {
  type: typeof SUBMIT_TASK;
  payload: {
    content: string;
    history: History;
  };
}

export interface SubmitTaskErrorAction {
  type: typeof SUBMIT_TASK_ERROR;
  payload: TaskContentError;
}

export interface SubmittedTaskAction {
  type: typeof SUBMITTED_TASK;
}

export interface PollTaskAction {
  type: typeof POLL_TASK;
  payload: {
    id: string;
  };
}

export interface PolledTaskAction {
  type: typeof POLLED_TASK;
}

export interface UpdateTaskAction {
  type: typeof UPDATE_TASK;
  payload: Task;
}

export enum TaskContentErrorType {
  UNKNOWN_TOKEN = "UNKNOWN_TOKEN",
  UNEXPECTED_END = "UNEXPECTED_END",
  UNEXPECTED_TOKEN = "UNEXPECTED_TOKEN",
  EMPTY = "EMPTY",
  // unexpected error, e.g. network, ...etc.
  OTHER = "OTHER"
}

export interface TaskContentError {
  type: TaskContentErrorType;
  position: number | null;
  token: string | null;
}

export interface Task {
  id: string;
  state: string;
  content: string;
  result: TaskResult;
}

export interface TaskResult {
  [key: string]: number | undefined | null;
  _loss?: number;
}

export interface TaskEpicDependencies {
  taskApi: typeof apiTask;
}
