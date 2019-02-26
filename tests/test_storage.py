import pytest
import time
import concurrent.futures
from redis import Redis
from algebra_solver.storage import TaskStorage, Task, TaskState


@pytest.fixture
def redis():
    return Redis(host='127.0.0.1', port=6379)


@pytest.fixture
def storage(redis):
    return TaskStorage(redis)


def test_storage(storage):
    task = Task(
        id_=None,
        state=TaskState.DONE,
        content='x + 1 = 0',
        result={'x': -1}
    )

    storage.put_task(task)

    assert task.id_ is not None

    stored_task = storage.get_task(task.id_)

    assert stored_task.id_ == task.id_
    assert stored_task.state == task.state
    assert stored_task.content == task.content
    assert stored_task.result == task.result


def test_get_empty_task(storage):
    task = storage.get_task(404)
    assert task is None


def test_storage_pubsub(storage):
    task = Task(
        id_=None,
        state=TaskState.SOLVING,
        content='x + 1 = 0',
        result={'x': 0}
    )

    storage.put_task(task)

    def change_task_status_later():
        time.sleep(2)
        task.state = TaskState.DONE
        task.result['x'] = -1
        storage.put_task(task)

    def check_task_status_later(id_):
        task = storage.subscribe_task_change(id_)
        assert task.state == TaskState.Done
        assert task.result['x'] == -1

    with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
        executor.submit(change_task_status_later)
        executor.submit(check_task_status_later, task.id_)
