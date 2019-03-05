import pytest
import json
from algebra_solver.web import create_app
from algebra_solver.web.extension import redis, task_storage, celery, background_task
from algebra_solver.web.extension.storage import Task, TaskState
from algebra_solver.web.config import TestConfig


@pytest.fixture
def app():
    app = create_app(TestConfig)

    with app.app_context():
        yield app
        redis.connection.flushall()


@pytest.fixture
def client(app):
    return app.test_client()


def test_app_configuration(app):
    assert app.config['TESTING'] == TestConfig.TESTING
    assert app.config['REDIS_HOST'] == TestConfig.REDIS_HOST
    assert app.config['REDIS_PORT'] == TestConfig.REDIS_PORT
    assert app.config['CELERY_BROKER'] == TestConfig.CELERY_BROKER


def test_redis_connection(app):
    assert redis.connection.client_id() is not None


def test_storage(app):
    storage = task_storage.storage
    assert storage._redis == redis.connection


def test_celery(app):
    celery_app = celery.app
    assert celery_app is not None


def test_task_api_create_task(client):
    res = client.post('/task/', data={'content': 'x - 1 = 0'})
    task_dict = json.loads(res.data.decode())['task']
    assert 'id' in task_dict
    assert task_dict['id'] is not None
    assert 'state' in task_dict
    assert TaskState(task_dict['state']) == TaskState.INITIAL
    assert 'content' in task_dict
    assert task_dict['content'] == 'x - 1 = 0'
    assert 'result' in task_dict
    assert task_dict['result']['x'] is None


def test_task_api_create_task_malform_request(client):
    res = client.post('/task/')
    assert res.status_code == 400

    res = client.post('/task/', data={'content': 'x - 1'})
    assert res.status_code == 400

    res = client.post('/task/', data={'content': '中文'})
    assert res.status_code == 400


def test_task_api_get_task(client):
    original_task = task_storage.storage.new_task('x - 1 = 0')
    task_storage.storage.put_task(original_task)
    res = client.get('/task/{}'.format(original_task.id_))
    assert res.status_code == 200
    retrieved_task = json.loads(res.data.decode())['task']
    assert retrieved_task['id'] == original_task.id_
    assert retrieved_task['content'] == original_task.content
    assert retrieved_task['result'] == original_task.result


def test_task_api_get_task_empty(client):
    nonexist_task_id = 4413
    res = client.get('/task/{}'.format(nonexist_task_id))
    assert res.status_code == 200
    retrieved_task = json.loads(res.data.decode())['task']
    assert retrieved_task is None
