"""Store configuration for flask application"""
import os
from dotenv import load_dotenv
load_dotenv()


class BaseConfig:
    TESTING = False
    REDIS_HOST = os.getenv('REDIS_HOST', '127.0.0.1')
    REDIS_PORT = int(os.getenv('REDIS_PORT', 6379))
    CELERY_BROKER = os.getenv('CELERY_BROKER', 'redis://127.0.0.1:6379/0')


class TestConfig(BaseConfig):
    TESTING = True
    REDIS_HOST = '127.0.0.1'
    REDIS_PORT = 6379
    CELERY_BROKER = 'redis://127.0.0.1:6379/0'
