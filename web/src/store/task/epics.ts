import _ from 'lodash';
import { ofType, ActionsObservable, StateObservable, combineEpics } from 'redux-observable';
import { Observable, Observer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { pollTask, updateTask, submittedTask, polledTask, submitTaskError } from './actions';
import { PollTaskAction, SubmitTaskAction, SubmittedTaskAction, SUBMIT_TASK, POLL_TASK, UpdateTaskAction, TaskEpicDependencies, PolledTaskAction, SubmitTaskErrorAction, TaskContentErrorType } from './types';
import { RootState } from '../types';

type SubmitTaskEpicActions = PollTaskAction | SubmittedTaskAction | SubmitTaskErrorAction;

export const submitTaskEpic = (action$: ActionsObservable<SubmitTaskAction>, state$: StateObservable<RootState> | null, { taskApi }: TaskEpicDependencies) => action$.pipe(
    ofType(SUBMIT_TASK),
    switchMap((action): Observable<SubmitTaskEpicActions> => {
        return Observable.create(
            (observer: Observer<SubmitTaskEpicActions>) => {
                taskApi.createTask(action.payload.content)
                    .then(
                        res => {
                            const task = res.data.task;
                            action.payload.history.push(`/task/${task.id}`);
                            observer.next(submittedTask());
                            observer.next(pollTask(task.id));
                        }
                    )
                    .catch(
                        err => {
                            const taskContentError = _.get(err, 'response.data.error');
                            if (taskContentError) {
                                observer.next(submitTaskError(taskContentError));
                            } else {
                                const otherError = {
                                    type: TaskContentErrorType.OTHER,
                                    position: null,
                                    token: null
                                };
                                observer.next(submitTaskError(otherError));
                            }
                        }
                    )
                    .finally(() => observer.complete());
            }
        );
    })
);

type PollTaskEpicActions = UpdateTaskAction | PolledTaskAction;

export const pollTaskEpic = (action$: ActionsObservable<PollTaskAction>, state$: StateObservable<RootState> | null, { taskApi }: TaskEpicDependencies) => action$.pipe(
    ofType(POLL_TASK),
    switchMap((action): Observable<PollTaskEpicActions> => {
        return Observable.create((observer: Observer<PollTaskEpicActions>) => {
            taskApi
                .pollTask(action.payload.id)
                .subscribe(
                    task => {
                        observer.next(updateTask(task));
                    },
                    undefined,
                    () => {
                        observer.next(polledTask());
                        observer.complete();
                    });
        });
    })
);

export const taskEpic = combineEpics(
    submitTaskEpic,
    pollTaskEpic
);