import {
  configureStore as reduxStarterConfigureStore,
  getDefaultMiddleware
} from "redux-starter-kit";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import { taskReducer } from "./task/reducers";
import { taskEpic } from "./task/epics";
import { RootState } from "./types";
import * as taskApi from "../api/task";

export const configureStore = (preloadedState?: RootState) => {
  const epicMiddleware = createEpicMiddleware({
    dependencies: {
      taskApi
    }
  });

  const middlewares = [epicMiddleware, ...getDefaultMiddleware()];

  const store = reduxStarterConfigureStore<RootState>({
    reducer: {
      task: taskReducer
    },
    middleware: middlewares,
    preloadedState
  });

  const rootEpic = combineEpics(taskEpic);

  epicMiddleware.run(rootEpic);

  return store;
};
