"""Wrapper of algebra_sovler.storage module

The storage instance obtained from this module will use redis instance
 that read configuration from flask application.
"""
from flask import current_app
from algebra_solver.storage import TaskStorage, Task, TaskState

__ALL__ = ['TaskStorageExtension', 'TaskStorage', 'Task', 'TaskState']


class TaskStorageExtension:
    def __init__(self, app=None, redis_ext=None):
        if app is not None:
            self.init_app(app, redis_ext)

    def init_app(self, app, redis_ext):
        app.extensions['task_storage_redis_ext'] = redis_ext

    @property
    def storage(self):
        return TaskStorage(current_app.extensions['task_storage_redis_ext'].connection)
