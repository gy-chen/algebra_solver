from .redis import RedisExtension
from .storage import TaskStorageExtension
from .celery import CeleryExtension
from .background_task import BackgroundTaskExtension

__ALL__ = ['redis', 'task_storage', 'celery', 'background_task']

redis = RedisExtension()
task_storage = TaskStorageExtension()
celery = CeleryExtension()
background_task = BackgroundTaskExtension()
