import { ofType, ActionsObservable } from 'redux-observable';
import { Observable, Observer, } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PollTaskAction, SubmitTaskAction, SUBMIT_TASK, POLL_TASK, UpdateTaskAction } from './types';

export const submitTaskEpic = (action$: ActionsObservable<SubmitTaskAction>) => action$.pipe(
    ofType(SUBMIT_TASK),
    switchMap((action): Observable<PollTaskAction> => {
        return Observable.create(
            (observer: Observer<PollTaskAction>) => {
                // TODO call createTask api
                // TODO after createTask success, emit PollTaskAction, and finished observable.
                // TODO remove me later
                observer.complete();
            }
        );
    })
);

export const pollTaskEpic = (action$: ActionsObservable<PollTaskAction>) => action$.pipe(
    ofType(POLL_TASK),
    switchMap((action): Observable<UpdateTaskAction> => {
        return Observable.create(
            (observer: Observer<UpdateTaskAction>) => {
                // TODO poll through websocket
                // TODO keep update from data received from websocket
                // TODO complte observer when websocket is closed
                // TODO remove me later
                observer.complete();
            }
        );
    })
);