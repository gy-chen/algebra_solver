"""Flask blueprint for serving tasks relates APIs

Provides:
  - create task: let user submit what algebra want to solve

  - get task: get data of the task

"""
import asyncio
import json
from flask import Blueprint, jsonify, request, abort
from algebra_solver.web.extension import task_storage
from algebra_solver.web.extension import background_task
from algebra_solver.web.extension.storage import TaskState
from algebra_solver.lang.parser import ParseException
from algebra_solver.lang.lexer import UnknownTokenError

task = Blueprint('task', __name__)


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
        task_dict = {
            'id': None,
            'state': None,
            'content': None,
            'result': None
        }
    # TODO add status
    return jsonify(task=task_dict)


@task.route('/', methods=['POST'])
def create_task():
    try:
        content = request.form['content']
    except KeyError:
        abort(400)
    storage = task_storage.storage
    try:
        task = storage.new_task(content)
    except (ParseException, UnknownTokenError):
        # TODO add error message and status
        abort(400)
    storage.put_task(task)
    background_task.solve_task(task.id_)
    task_dict = {
        'id': task.id_,
        'state': task.state.value,
        'content': task.content,
        'result': task.result
    }
    # TODO add status
    return jsonify(task=task_dict)


@task.route('/polling/{id_}')
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
    while task and task.state != TaskState.DONE and task.state != TaskState.ERROR:
        task_coroute = task_storage.storage.subscribe_task_change(id_)
        # TODO read timeout setting
        task_coroute = asyncio.wait_for(task_coroute, 10)
        try:
            task = asyncio.get_event_loop().run_until_complete(task_coroute)
        except asyncio.TimeoutError:
            task = task_storage.storage.get_task(id_)
        if task:
            task_dict = {
                'id': task.id_,
                'content': task.content,
                'state': task.state.value,
                'result': task.result
            }
            ws.send(json.dumps(task_dict))
