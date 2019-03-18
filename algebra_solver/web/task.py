"""Background tasks

Provides:
  - solve specific task that store in redis storage.
"""
import celery
from algebra_solver.storage import TaskState
from algebra_solver.lang.lexer import tokenize
from algebra_solver.lang.parser import parse
from algebra_solver.tf import eval as eval_


@celery.shared_task()
def solve_task(id_):
    from algebra_solver.web.extension import task_storage
    task = task_storage.storage.get_task(id_)
    if task is None:
        return
    task.state = TaskState.SOLVING
    task_storage.storage.put_task(task)
    expression = parse(tokenize(task.content))
    try:
        task.result = eval_(expression)
        task.state = TaskState.DONE
        task_storage.storage.put_task(task)
    except:
        task.state = TaskState.ERROR
        task_storage.storage.put_task(task)
