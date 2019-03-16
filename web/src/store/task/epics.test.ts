import { ActionsObservable } from 'redux-observable';
import { TestScheduler } from 'rxjs/testing';
import { createMemoryHistory } from 'history';
import { submitTaskEpic, pollTaskEpic } from './epics';
import * as taskApi from '../../api/task';
import { submitTask, pollTask, submitTaskError, submittedTask, updateTask, polledTask } from './actions';
import { TaskContentErrorType } from './types';

it('submitTaskEpic', (done) => {

    describe('submit success', () => {
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
            };

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

    describe('submit content error', () => {

        const testScheduler = new TestScheduler((actual, expected) => {
            // XXX setTimeout so the epic output can be collected, maybe has a better way
            setTimeout(() => {
                expect(actual).toEqual(expected);
                done();
            }, 10);
        });

        testScheduler.run(({ hot, expectObservable }) => {

            const mockHistory = createMemoryHistory();

            const mockSubmitError = {
                type: TaskContentErrorType.UNEXPECTED_END,
                position: 0,
                token: null
            };

            const mockTaskApi: typeof taskApi = {
                createTask: jest.fn(() => Promise.reject({
                    response: {
                        data: {
                            error: mockSubmitError
                        },
                        status: 400,
                        statusText: 'Bad Request',
                        headers: null,
                        config: {}
                    }
                })),
                pollTask: jest.fn()
            };

            const source = hot('-a', {
                a: submitTask('', mockHistory)
            });
            const action$ = ActionsObservable.from(source);

            const state$ = null;

            const dependencies = {
                taskApi: mockTaskApi
            };

            const output$ = submitTaskEpic(action$, state$, dependencies);

            expectObservable(output$).toBe('-a', {
                a: submitTaskError(mockSubmitError),
            });
        });
    });

    describe('submit other error', () => {

        const testScheduler = new TestScheduler((actual, expected) => {
            // XXX setTimeout so the epic output can be collected, maybe has a better way
            setTimeout(() => {
                expect(actual).toEqual(expected);
                done();
            }, 10);
        });

        testScheduler.run(({ hot, expectObservable }) => {

            const mockHistory = createMemoryHistory();

            const mockTaskApi: typeof taskApi = {
                createTask: jest.fn(() => Promise.reject({
                })),
                pollTask: jest.fn()
            };

            const source = hot('-a', {
                a: submitTask('', mockHistory)
            });
            const action$ = ActionsObservable.from(source);

            const state$ = null;

            const dependencies = {
                taskApi: mockTaskApi
            };

            const output$ = submitTaskEpic(action$, state$, dependencies);

            expectObservable(output$).toBe('-a', {
                a: submitTaskError({
                    type: TaskContentErrorType.OTHER,
                    position: null,
                    token: null
                }),
            });
        });
    });
});

it('pollTaskEpic', () => {
    const testScheduler = new TestScheduler((actual, expected) => {
        // XXX setTimeout so the epic output can be collected, maybe has a better way
        setTimeout(() => {
            expect(actual).toEqual(expected);
        }, 50);
    });

    testScheduler.run(({ hot, cold, expectObservable }) => {

        const solvingTask = {
            id: '4413',
            state: 'SOLVING',
            content: 'x - 1 = 0',
            result: {
                x: null
            }
        };

        const doneTask = {
            id: '4413',
            state: 'DONE',
            content: 'x - 1 = 0',
            result: {
                x: 0,
                _loss: 0
            }
        };

        const mockTaskApi: typeof taskApi = {
            createTask: jest.fn(),
            pollTask: jest.fn(() => cold('-ab', {
                a: solvingTask,
                b: doneTask
            }))
        };

        const source = hot('-a', {
            a: pollTask('4413')
        });
        const action$ = ActionsObservable.from(source);

        const state$ = null;

        const dependencies = {
            taskApi: mockTaskApi
        };

        const output$ = pollTaskEpic(action$, state$, dependencies);

        expectObservable(output$).toBe('--a(bc)', {
            a: updateTask(solvingTask),
            b: updateTask(doneTask),
            c: polledTask()
        });
    });
})