"""Flask blueprint for serving tasks relates APIs

Provides:
  - create task: let user submit what algebra want to solve

  - get task: get data of the task

"""
import asyncio
import collections
import enum
import json
from functools import singledispatch
from flask import Blueprint, jsonify, request, abort
from algebra_solver.web.extension import task_storage
from algebra_solver.web.extension import background_task
from algebra_solver.web.extension.storage import TaskState
from algebra_solver.lang.parser import ParseException, UnexpectEndException, UnexpectTokenException
from algebra_solver.lang.lexer import UnknownTokenError

task = Blueprint('task', __name__)

TaskContentError = collections.namedtuple(
    'TaskContentError', 'type token position')


class TaskContentErrorType(enum.Enum):
    UNKNOWN_TOKEN = 'UNKNOWN_TOKEN'
    UNEXPECTED_END = 'UNEXPECTED_END'
    UNEXPECTED_TOKEN = 'UNEXPECTED_TOKEN'
    EMPTY = 'EMPTY'


@task.route('/<id_>')
def get_task(id_):
    task = task_storage.storage.get_task(id_)
    if task is not None:
        task_dict = {
            'id': task.id_,
            'state': task.state.value,
            'content': task.content,
            'result': task.result
        }
    else:
        task_dict = None
    return jsonify(task=task_dict)


@task.route('/', methods=['POST'])
def create_task():
    try:
        content = request.form['content']
    except KeyError:
        task_content_error = TaskContentError(
            type=TaskContentErrorType.EMPTY.value, token=None, position=None)
        return jsonify(error=task_content_error._asdict()), 400
    storage = task_storage.storage
    try:
        task = storage.new_task(content)
    except (ParseException, UnknownTokenError) as e:
        task_content_error = _get_task_content_error(e)
        return jsonify(error=task_content_error._asdict()), 400
    storage.put_task(task)
    background_task.solve_task(task.id_)
    task_dict = {
        'id': task.id_,
        'state': task.state.value,
        'content': task.content,
        'result': task.result
    }
    return jsonify(task=task_dict)


@singledispatch
def _get_task_content_error(e):
    raise TypeError()


@_get_task_content_error.register(UnexpectEndException)
def _(e):
    return TaskContentError(type=TaskContentErrorType.UNEXPECTED_END.value, token=None, position=None)


@_get_task_content_error.register(UnexpectTokenException)
def _(e):
    return TaskContentError(type=TaskContentErrorType.UNEXPECTED_TOKEN.value, token=e.token.value, position=e.token.position)


@_get_task_content_error.register(UnknownTokenError)
def _(e):
    return TaskContentError(type=TaskContentErrorType.UNKNOWN_TOKEN.value, position=e.position, token=None)


@task.route('/polling/<id_>')
def polling_task(id_):
    """Polling task changes until reach final state

    Use websocket connection to transfer task changes.

    End connection when the task is reach final state, e.g. DONE, ERROR.

    End connection immediately without send anydata if cannot get the task of specific id.
    """
    ws = request.environ.get('wsgi.websocket')

    if not ws:
        abort(400, "Expected WebSocket request")

    task = task_storage.storage.get_task(id_)
    _send_task(ws, task)
    while task and task.state != TaskState.DONE and task.state != TaskState.ERROR:
        task_coroute = task_storage.storage.subscribe_task_change(id_)
        # TODO read timeout setting
        task_coroute = asyncio.wait_for(task_coroute, 5)
        try:
            task = asyncio.run(task_coroute)
        except asyncio.TimeoutError:
            task = task_storage.storage.get_task(id_)
        if task:
            _send_task(ws, task)
    return ('', 204)


def _send_task(ws, task):
    task_dict = {
        'id': task.id_,
        'content': task.content,
        'state': task.state.value,
        'result': task.result
    }
    ws.send(json.dumps(task_dict))
