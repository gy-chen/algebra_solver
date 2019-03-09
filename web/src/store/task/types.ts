export const SUBMIT_TASK = 'SUBMIT_TASK';
export const POLL_TASK = 'POLL_TASK';
export const UPDATE_TASK = 'UPDATE_TASK';

export interface TaskState {
    currentTask: Task | null
};

export interface SubmitTaskAction {
    type: typeof SUBMIT_TASK,
    payload: {
        content: string
    }
};

export interface PollTaskAction {
    type: typeof POLL_TASK,
    payload: {
        id: string
    }
};

export interface UpdateTaskAction {
    type: typeof UPDATE_TASK,
    payload: Task
};

export interface Task {
    id: string,
    content: string,
    result: TaskResult
};

export interface TaskResult {
    [key: string]: number,
    _loss: number
};