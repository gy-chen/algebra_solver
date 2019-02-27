"""Store configuration for flask application"""

# TODO read config from enviroment


class TestConfig:
    TESTING = True
    REDIS_HOST = '127.0.0.1'
    REDIS_PORT = 6379
    CELERY_BROKER = 'redis://127.0.0.1:6379/0'
