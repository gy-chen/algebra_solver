import { createReducer } from 'redux-starter-kit';
import {
    UPDATE_TASK,
    TaskState,
    UpdateTaskAction
} from './types';

const initalState: TaskState = {
    currentTask: null
};

export const taskReducer = createReducer(initalState, {
    [UPDATE_TASK]: (state, action: UpdateTaskAction) => {
        state.currentTask = action.payload;
    }
});