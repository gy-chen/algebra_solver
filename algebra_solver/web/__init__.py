"""Provide flask application for serving API"""
from flask import Flask
from algebra_solver.web.api.task import task as task_api
from algebra_solver.web.extension import redis, task_storage, celery, background_task


def create_app(config=None):
    app = Flask(__name__)
    if config is None:
        app.config.from_object('algebra_solver.web.config.BaseConfig')
    else:
        app.config.from_object(config)

    redis.init_app(app)
    task_storage.init_app(app, redis)
    celery.init_app(app)
    background_task.init_app(app, celery)
    app.register_blueprint(task_api, url_prefix='/task')

    return app
