import { createMemoryHistory } from 'history';
import { taskReducer } from './reducers';
import { TaskState, Task } from './types';
import { submitTask, submittedTask, updateTask } from './actions';

it('updateTask', () => {
    const initialState: TaskState = {
        submitting: false,
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
    const initialState: TaskState = {
        submitting: false,
        currentTask: null
    };

    const mockHistory = createMemoryHistory();

    const stateAfterUpdate = taskReducer(initialState, submitTask('x - 1 = 0', mockHistory));

    expect(stateAfterUpdate.submitting).toEqual(true);
});

it('submittedTask', () => {
    const initialState: TaskState = {
        submitting: true,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, submittedTask());

    expect(stateAfterUpdate.submitting).toEqual(false);
});