"""Wrapper for celery client

Use this for reading configuration from flask application.
"""
from celery import Celery
from flask import current_app, _app_ctx_stack


class CeleryExtension:

    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.config.setdefault('CELERY_BROKER', None)

    @property
    def app(self):
        ctx = _app_ctx_stack.top
        if not hasattr(ctx, 'celery'):
            ctx.celery = Celery(broker=current_app.config['CELERY_BROKER'])
        return ctx.celery
