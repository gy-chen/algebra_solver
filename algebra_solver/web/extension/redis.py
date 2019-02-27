"""Wrapper for redis client

Use this for reading configuration from flask application.
"""
import redis
from flask import current_app, _app_ctx_stack


class RedisExtension:
    def __init__(self, app=None):
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.config.setdefault('REDIS_HOST', '127.0.0.1')
        app.config.setdefault('REDIS_PORT', 6379)

    def connect(self):
        host = current_app.config['REDIS_HOST']
        port = current_app.config['REDIS_PORT']
        return redis.Redis(host=host, port=port)

    @property
    def connection(self):
        ctx = _app_ctx_stack.top
        if not hasattr(ctx, 'redis_connection'):
            ctx.redis_connection = self.connect()
        return ctx.redis_connection
