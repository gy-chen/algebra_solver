import { ofType, ActionsObservable, StateObservable, combineEpics } from 'redux-observable';
import { Observable, Observer } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { pollTask, updateTask, submittedTask } from './actions';
import { PollTaskAction, SubmitTaskAction, SubmittedTaskAction, SUBMIT_TASK, POLL_TASK, UpdateTaskAction, TaskEpicDependencies, Task } from './types';
import { RootState } from '../types';

type SubmitTaskEpicActions = PollTaskAction | SubmittedTaskAction;

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
                    .finally(() => observer.complete());
            }
        );
    })
);

export const pollTaskEpic = (action$: ActionsObservable<PollTaskAction>, state$: StateObservable<RootState>, { taskApi }: TaskEpicDependencies) => action$.pipe(
    ofType(POLL_TASK),
    switchMap((action): Observable<UpdateTaskAction> => {
        return taskApi.pollTask(action.payload.id).pipe(
            map((task: Task) => updateTask(task))
        );
    })
);

export const taskEpic = combineEpics(
    submitTaskEpic,
    pollTaskEpic
);