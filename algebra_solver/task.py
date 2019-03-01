"""Background tasks

Provides:
  - solve specific task that store in redis storage.
"""
from algebra_solver.storage import TaskState
from algebra_solver.lang.lexer import tokenize
from algebra_solver.lang.parser import parse
from algebra_solver.tf import eval as eval_


class BackgroundTask:

    def __init__(self, celery, storage):
        self.solve_task = celery.task(self.solve_task)
        self._storage = storage

    def solve_task(self, id_):
        task = self._storage.get_task(id_)
        if task is None:
            return
        task.state = TaskState.SOLVING
        self._storage.put_task(task)
        expression = parse(tokenize(task.content))
        task.result = eval_(expression)
        task.state = TaskState.DONE
        self._storage.put_task(task)
