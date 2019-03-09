import {
    SUBMIT_TASK,
    POLL_TASK,
    UPDATE_TASK,
    SubmitTaskAction,
    PollTaskAction,
    UpdateTaskAction,
    Task
} from './types';

export const submitTask = (content: string): SubmitTaskAction => {
    return {
        type: SUBMIT_TASK,
        payload: {
            content
        }
    };
};

export const pollTask = (id: string): PollTaskAction => {
    return {
        type: POLL_TASK,
        payload: {
            id
        }
    };
};

export const updateTask = (task: Task): UpdateTaskAction => {
    return {
        type: UPDATE_TASK,
        payload: task
    };
};