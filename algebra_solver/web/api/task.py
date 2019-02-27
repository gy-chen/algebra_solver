"""Flask blueprint for serving tasks relates APIs

Provides:
  - create task: let user submit what algebra want to solve

  - get task: get data of the task

"""
from flask import Blueprint, jsonify, request, abort
from algebra_solver.web.extension import task_storage
from algebra_solver.web.extension import background_task
from algebra_solver.lang.parser import ParseException
from algebra_solver.lang.lexer import UnknownTokenError

task = Blueprint('task', __name__)


@task.route('/<id_>')
def get_task(id_):
    task = task_storage.storage.get_task(id_)
    task_dict = {
        'id': task.id_,
        'state': task.state.value,
        'content': task.content,
        'result': task.result
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
    background_task.background_task.solve_task(task.id_)
    task_dict = {
        'id': task.id_,
        'state': task.state.value,
        'content': task.content,
        'result': task.result
    }
    # TODO add status
    return jsonify(task=task_dict)
