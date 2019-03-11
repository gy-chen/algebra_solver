import { taskReducer } from './reducers';
import { TaskState, UPDATE_TASK, UpdateTaskAction, Task } from './types';

it('updateTask', () => {
    const initialState: TaskState = {
        currentTask: {
            id: '4413',
            content: 'x - 1 = 0',
            state: 'SOLVING',
            result: {
                x: null
            }
        }
    };

    const updateTask: Task = {
        id: '4413',
        content: 'x - 1 = 0',
        state: 'DONE',
        result: {
            x: 1,
            _loss: 0
        }
    };

    const updateTaskAction: UpdateTaskAction = {
        type: UPDATE_TASK,
        payload: updateTask
    };

    const stateAfterUpdate = taskReducer(initialState, updateTaskAction);

    expect(stateAfterUpdate).toEqual({
        currentTask: updateTask
    });
});