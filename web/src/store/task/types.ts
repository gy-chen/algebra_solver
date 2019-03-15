import { History } from 'history';
import * as apiTask from '../../api/task';

export const SUBMIT_TASK = 'SUBMIT_TASK';
export const SUBMITTED_TASK = 'SUBMITTED_TASK';
export const POLL_TASK = 'POLL_TASK';
export const POLLED_TASK = 'POLLED_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

export interface TaskRootState {
    state: TaskState,
    currentTask: Task | null
};

export enum TaskState {
    INITIAL,
    SUBMITTING,
    POLLING
};

export interface SubmitTaskAction {
    type: typeof SUBMIT_TASK,
    payload: {
        content: string,
        history: History
    }
};

export interface SubmittedTaskAction {
    type: typeof SUBMITTED_TASK
};

export interface PollTaskAction {
    type: typeof POLL_TASK,
    payload: {
        id: string
    }
};

export interface PolledTaskAction {
    type: typeof POLLED_TASK
}

export interface UpdateTaskAction {
    type: typeof UPDATE_TASK,
    payload: Task
};

export interface Task {
    id: string,
    state: string,
    content: string,
    result: TaskResult
};

export interface TaskResult {
    [key: string]: number | undefined | null,
    _loss?: number
};

export interface TaskEpicDependencies {
    taskApi: typeof apiTask
};