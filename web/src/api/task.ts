import axios from "axios";
import { Observable, Observer } from "rxjs";
import { Task } from "../store/task/types";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL
});

export const createTask = (content: string) => {
  const data = new URLSearchParams();
  data.append("content", content);
  return client.post("/task/", data);
};

export const pollTask = (id: string): Observable<Task> => {
  return Observable.create((observer: Observer<Task>) => {
    const ws = new WebSocket(
      `${process.env.REACT_APP_WS_BASEURL}/task/polling/${id}`
    );

    ws.addEventListener("message", event => {
      const task = JSON.parse(event.data);
      observer.next(task);
    });

    ws.addEventListener("close", () => {
      observer.complete();
    });
  });
};
