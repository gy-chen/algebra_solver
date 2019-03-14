import { createReducer } from 'redux-starter-kit';
import {
    SUBMIT_TASK,
    SUBMITTED_TASK,
    UPDATE_TASK,
    TaskState,
    UpdateTaskAction
} from './types';

const initalState: TaskState = {
    submitting: false,
    currentTask: null
};

export const taskReducer = createReducer(initalState, {
    [UPDATE_TASK]: (state, action: UpdateTaskAction) => {
        state.currentTask = action.payload;
    },
    [SUBMIT_TASK]: (state) => {
        state.submitting = true;
    },
    [SUBMITTED_TASK]: (state) => {
        state.submitting = false;
    }
});