import { createMemoryHistory } from 'history';
import { taskReducer } from './reducers';
import { TaskRootState, Task, TaskState } from './types';
import { submitTask, submittedTask, updateTask, pollTask, polledTask } from './actions';

it('updateTask', () => {
    const initialState: TaskRootState = {
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

    const initialState: TaskRootState = {
        state: TaskState.INITIAL,
        currentTask: null
    };

    const mockHistory = createMemoryHistory();

    const stateAfterUpdate = taskReducer(initialState, submitTask('x - 1 = 0', mockHistory));

    expect(stateAfterUpdate.state).toEqual(TaskState.SUBMITTING);

});

it('submittedTask', () => {
    const initialState: TaskRootState = {
        state: TaskState.SUBMITTING,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, submittedTask());

    expect(stateAfterUpdate.state).toEqual(TaskState.INITIAL);
});

it('pollTask', () => {
    const initialState: TaskRootState = {
        state: TaskState.INITIAL,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, pollTask('4413'));

    expect(stateAfterUpdate.state).toEqual(TaskState.POLLING);
});

it('polledTask', () => {
    const initialState: TaskRootState = {
        state: TaskState.POLLING,
        currentTask: null
    };

    const stateAfterUpdate = taskReducer(initialState, polledTask());

    expect(stateAfterUpdate.state).toEqual(TaskState.INITIAL);
});