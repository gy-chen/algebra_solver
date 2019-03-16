import { History } from 'history';
import {
    SUBMIT_TASK,
    SUBMIT_TASK_ERROR,
    SUBMITTED_TASK,
    POLL_TASK,
    POLLED_TASK,
    UPDATE_TASK,
    SubmitTaskAction,
    SubmitTaskErrorAction,
    PollTaskAction,
    UpdateTaskAction,
    Task,
    SubmittedTaskAction,
    PolledTaskAction,
    TaskContentError
} from './types';

export const submitTask = (content: string, history: History): SubmitTaskAction => {
    return {
        type: SUBMIT_TASK,
        payload: {
            content,
            history
        }
    };
};

export const submitTaskError = (error: TaskContentError): SubmitTaskErrorAction => {
    return {
        type: SUBMIT_TASK_ERROR,
        payload: error
    };
}

export const submittedTask = (): SubmittedTaskAction => {
    return {
        type: SUBMITTED_TASK
    };
}

export const pollTask = (id: string): PollTaskAction => {
    return {
        type: POLL_TASK,
        payload: {
            id
        }
    };
};

export const polledTask = (): PolledTaskAction => {
    return {
        type: POLLED_TASK
    };
}

export const updateTask = (task: Task): UpdateTaskAction => {
    return {
        type: UPDATE_TASK,
        payload: task
    };
};