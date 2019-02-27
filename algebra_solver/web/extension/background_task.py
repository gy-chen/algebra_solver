"""Provide celery background tasks

This will use celery instance of flask extension.
"""
from flask import current_app
from algebra_solver.task import BackgroundTask


class BackgroundTaskExtension:
    def __init__(self, app=None, celery_ext=None):
        if app is not None and celery_ext is not None:
            self.init_app(app, celery_ext)

    def init_app(self, app, celery_ext):
        app.extensions['task_celery_ext'] = celery_ext

    @property
    def background_task(self):
        return BackgroundTask(current_app.extensions['task_celery_ext'].app)
