import { ActionsObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';
import { createMemoryHistory } from 'history';
import { submitTaskEpic } from './epics';
import * as taskApi from '../../api/task';
import { submitTask, pollTask, submittedTask } from './actions';

it('submitTaskEpic', (done) => {
    const mockHistory = createMemoryHistory();

    const testScheduler = new TestScheduler((actual, expected) => {
        // XXX setTimeout so the epic output can be collected, maybe has a better way
        setTimeout(() => {
            expect(actual).toEqual(expected);
            expect(mockHistory.location.pathname).toEqual('/task/4413');
            done();
        }, 10);
    });

    testScheduler.run(({ hot, expectObservable }) => {

        const mockTaskApi: typeof taskApi = {
            createTask: jest.fn(() => Promise.resolve({
                data: {
                    task: {
                        id: '4413'
                    }
                },
                status: 200,
                statusText: 'OK',
                headers: null,
                config: {}
            })),
            pollTask: jest.fn()
        }

        const source = hot('-a', {
            a: submitTask('x - 1 = 0', mockHistory)
        });
        const action$ = ActionsObservable.from(source);

        const state$ = null;

        const dependencies = {
            taskApi: mockTaskApi
        };

        const output$ = submitTaskEpic(action$, state$, dependencies);

        expectObservable(output$).toBe('-(ab)', {
            a: submittedTask(),
            b: pollTask('4413')
        });
    });
});