"""Provide celery background tasks

This will use celery instance of flask extension.
"""
from flask import current_app
from algebra_solver.web.task import solve_task


class BackgroundTaskExtension:
    def __init__(self, app=None, celery_ext=None):
        if app is not None\
                and celery_ext is not None:
            self.init_app(app, celery_ext)

    def init_app(self, app, celery_ext):
        app.extensions['task_celery_ext'] = celery_ext

    def solve_task(self, id_):
        celery = current_app.extensions['task_celery_ext'].app
        with celery:
            solve_task.delay(id_)
