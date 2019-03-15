import { createReducer } from 'redux-starter-kit';
import {
    SUBMIT_TASK,
    SUBMITTED_TASK,
    POLL_TASK,
    POLLED_TASK,
    UPDATE_TASK,
    TaskRootState,
    TaskState,
    UpdateTaskAction
} from './types';

const initalState: TaskRootState = {
    state: TaskState.INITIAL,
    currentTask: null
};

export const taskReducer = createReducer(initalState, {
    [UPDATE_TASK]: (state, action: UpdateTaskAction) => {
        state.currentTask = action.payload;
    },
    [SUBMIT_TASK]: state => {
        state.state = TaskState.SUBMITTING;
    },
    [SUBMITTED_TASK]: state => {
        state.state = TaskState.INITIAL;
    },
    [POLL_TASK]: (state) => {
        state.state = TaskState.POLLING;
    },
    [POLLED_TASK]: state => {
        state.state = TaskState.INITIAL;
    }
});