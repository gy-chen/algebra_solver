import { ActionsObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';
import { createMemoryHistory } from 'history';
import { submitTaskEpic } from './epics';
import * as taskApi from '../../api/task';
import { submitTask, pollTask } from './actions';

it('submitTaskEpic', (done) => {
    const testScheduler = new TestScheduler(() => { });

    testScheduler.run(({ hot, expectObservable }) => {

        const mockHistory = createMemoryHistory();

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

        const expectActions = [
            pollTask('4413')
        ]

        output$.subscribe(
            action => {
                expect(action).toEqual(expectActions.shift());
                if (expectActions.length === 0) {
                    expect(mockHistory.location.pathname).toEqual('/task/4413');
                    done();
                }
            }
        );
    });
});