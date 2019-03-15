import { History } from 'history';
import {
    SUBMIT_TASK,
    SUBMITTED_TASK,
    POLL_TASK,
    POLLED_TASK,
    UPDATE_TASK,
    SubmitTaskAction,
    PollTaskAction,
    UpdateTaskAction,
    Task,
    SubmittedTaskAction,
    PolledTaskAction
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