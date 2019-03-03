"""Redis storage for store task data"""
import enum
import uuid
import asyncio
from functools import singledispatch
from collections import namedtuple
from algebra_solver.lang.lexer import tokenize
from algebra_solver.lang.parser import parse
from algebra_solver.lang.parser import EquationExpression
from algebra_solver.lang.parser import IdentifierExpression
from algebra_solver.lang.parser import InfixExpression


class Task:

    def __init__(self, id_=None, state=None, content=None, result=None):
        self._id = id_
        self._state = state
        self._content = content
        self._result = {} if result is None else result

    @property
    def id_(self):
        return self._id

    @id_.setter
    def id_(self, value):
        self._id = value

    @property
    def state(self):
        return self._state

    @state.setter
    def state(self, value):
        self._state = value

    @property
    def content(self):
        return self._content

    @content.setter
    def content(self, value):
        self._content = value

    @property
    def result(self):
        return self._result

    @result.setter
    def result(self, value):
        self._result = value


class TaskState(enum.Enum):
    INITIAL = 'INITIAL'
    SOLVING = 'SOLVING'
    DONE = 'DONE'
    ERROR = 'ERROR'


class TaskStorage:

    KEY_HASH = 'task:{id_}'
    HASH_KEY_STATE = 'state'
    HASH_KEY_CONTENT = 'content'
    KEY_VARIABLES = 'task:{id_}:variables'
    KEY_RESULT = 'task:{id_}:result'

    CHANNEL_CHANGE = 'task:change'

    def __init__(self, redis):
        self._redis = redis

    def new_task(self, content):
        """create a new task with default attributes

        raise: UnkownTokenException, ParseException
        """
        task = Task()
        equation_expression = parse(tokenize(content))
        variables = collect_variables(equation_expression)
        task.content = content
        task.state = TaskState.INITIAL
        task.result = {
            v: None
            for v in variables
        }
        return task

    def get_task(self, id_):
        task_state = self._retrive_state(id_)
        if task_state is None:
            return None
        variables = self._retrive_variables(id_)
        result = {variable: self._retrive_result(id_, variable)
                  for variable in variables}
        task = Task(
            id_=id_,
            state=task_state,
            content=self._retrive_content(id_),
            result=result
        )
        return task

    def put_task(self, task):
        if task.id_ is None:
            task.id_ = self._generate_id()
        self._put_state(task.id_, task.state)
        self._put_content(task.id_, task.content)
        self._put_variables(task.id_, task.result.keys())
        for variable, result in task.result.items():
            self._put_result(task.id_, variable, result)
        self._redis.publish(self.CHANNEL_CHANGE, task.id_)

    async def subscribe_task_change(self, id_):
        p = self._redis.pubsub()
        p.subscribe(self.CHANNEL_CHANGE)
        try:
            while True:
                await asyncio.sleep(0.1)
                message = p.get_message()
                if message and message['type'] == 'message' and message['data'].decode() == id_:
                    return self.get_task(id_)
        finally:
            p.close()

    def _generate_id(self):
        return str(uuid.uuid4())

    def _retrive_state(self, id_):
        state_text = self._redis.hget(
            self.KEY_HASH.format(id_=id_), self.HASH_KEY_STATE)
        if state_text is None:
            return None
        state_text = state_text.decode()
        return TaskState(state_text)

    def _retrive_content(self, id_):
        return self._redis.hget(self.KEY_HASH.format(id_=id_), self.HASH_KEY_CONTENT).decode()

    def _retrive_variables(self, id_):
        return [v.decode() for v in self._redis.smembers(self.KEY_VARIABLES.format(id_=id_))]

    def _retrive_result(self, id_, variable):
        result = self._redis.hget(self.KEY_RESULT.format(id_=id_), variable)
        return result if result is None else float(result)

    def _put_state(self, id_, state):
        self._redis.hset(self.KEY_HASH.format(
            id_=id_), self.HASH_KEY_STATE, state.value)

    def _put_content(self, id_, content):
        self._redis.hset(self.KEY_HASH.format(id_=id_),
                         self.HASH_KEY_CONTENT, content)

    def _put_variables(self, id_, variables):
        if not len(variables):
            return
        self._redis.sadd(self.KEY_VARIABLES.format(id_=id_), *variables)

    def _put_result(self, id_, variable, result):
        if result is None:
            return
        self._redis.hset(self.KEY_RESULT.format(
            id_=id_), variable, float(result))


def collect_variables(expression):
    context = set()
    _collect_variables(expression, context)
    return context


@singledispatch
def _collect_variables(expression, context):
    return


@_collect_variables.register(EquationExpression)
def _(expression, context):
    _collect_variables(expression.left, context)
    _collect_variables(expression.right, context)


@_collect_variables.register(IdentifierExpression)
def _(expression, context):
    context.add(expression.identifier)


@_collect_variables.register(InfixExpression)
def _(expression, context):
    _collect_variables(expression.left, context)
    _collect_variables(expression.right, context)
