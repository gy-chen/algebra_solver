import { createMemoryHistory } from 'history';
import { taskReducer } from './reducers';
import { TaskRootState, Task, TaskState, TaskContentErrorType, TaskContentError } from './types';
import { submitTask, submittedTask, updateTask, pollTask, polledTask, submitTaskError } from './actions';

it('updateTask', () => {
    const initialState: TaskRootState = {
        error: null,
        state: TaskState.INITIAL,
        currentTask: {
            id: '4413',
            content: 'x - 1 = 0',
            state: 'SOLVING',
            result: {
                x: null
            }
        }
    };

    const taskForUpdate: Task = {
        id: '4413',
        content: 'x - 1 = 0',
        state: 'DONE',
        result: {
            x: 1,
            _loss: 0
        }
    };

    const updateTaskAction = updateTask(taskForUpdate);
    const stateAfterUpdate = taskReducer(initialState, updateTaskAction);

    expect(stateAfterUpdate.currentTask).toEqual(taskForUpdate);
});

it('submitTask', () => {

    describe('from inital state', () => {
        const initialState: TaskRootState = {
            error: null,
            state: TaskState.INITIAL,
            currentTask: null
        };

        const mockHistory = createMemoryHistory();

        const stateAfterUpdate = taskReducer(initialState, submitTask('x - 1 = 0', mockHistory));

        expect(stateAfterUpdate.state).toEqual(TaskState.SUBMITTING);
    });

    describe('from error state', () => {
        const initialState: TaskRootState = {
            error: {
                type: TaskContentErrorType.UNEXPECTED_END,
                position: 0,
                token: null
            },
            state: TaskState.SUBMIT_ERROR,
            currentTask: null
        };

        const mockHistory = createMemoryHistory();

        const stateAfterUpdate = taskReducer(initialState, submitTask('x - 1 = 0', mockHistory));

        expect(stateAfterUpdate.state).toEqual(TaskState.SUBMITTING);
        expect(stateAfterUpdate.error).toBeNull();
    });
});

it('submitTaskError', () => {
    const initialState: TaskRootState = {
        error: null,
        state: TaskState.SUBMITTING,
        currentTask: null
    };

    const taskContentError: TaskContentError = {
        type: TaskContentErrorType.UNEXPECTED_END,
        position: 0,
        token: null
    };

    const stateAfterUpdate = taskReducer(initialState, submitTaskError(taskContentError));

    expect(stateAfterUpdate.state).toEqual(TaskState.SUBMIT_ERROR);
    expect(stateAfterUpdate.error).toEqual(taskContentError);
});

it('submittedTask', () => {
    const initialState: TaskRootState = {
        error: null,
        state: TaskState.SUBMITTING,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, submittedTask());

    expect(stateAfterUpdate.state).toEqual(TaskState.INITIAL);
});

it('pollTask', () => {
    const initialState: TaskRootState = {
        error: null,
        state: TaskState.INITIAL,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, pollTask('4413'));

    expect(stateAfterUpdate.state).toEqual(TaskState.POLLING);
});

it('polledTask', () => {
    const initialState: TaskRootState = {
        error: null,
        state: TaskState.POLLING,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, polledTask());

    expect(stateAfterUpdate.state).toEqual(TaskState.INITIAL);
});