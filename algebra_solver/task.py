"""Background tasks

Provides:
  - solve specific task that store in redis storage.
"""


class BackgroundTask:

    def __init__(self, celery):
        self.solve_task = celery.task(self.solve_task)

    def solve_task(self, id_):
        # TODO
        # retrieve task data from redis storage
        # update task data state
        # solve the task
        # update task result
        pass
