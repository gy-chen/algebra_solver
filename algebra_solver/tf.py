"""algebra solver evaluator using Tensorflow library.

eval
    function that solve algebra equation expression.
"""
import tensorflow as tf
from functools import singledispatch
from algebra_solver.lang import parser


class UnexpectOperatorTypeException(Exception):
    pass


def eval(equation_expression, steps=50000):
    """solve given equation

    :return dict: contain key as algebra variables, and value as result of the variable.
    """
    with tf.Graph().as_default():
        context = {}
        left = _eval(equation_expression.left, context)
        right = _eval(equation_expression.right, context)
        loss = ((right - left) ** 2) / 2

        optimizer = tf.train.AdamOptimizer()
        train = optimizer.minimize(loss)

        result = {}
        with tf.Session() as sess:
            init = tf.global_variables_initializer()
            sess.run(init)

            for _ in range(steps):
                sess.run(train)

            for var in context:
                result[var] = sess.run(context[var])

            result['_loss'] = sess.run(loss)

        return result


@singledispatch
def _eval(expression, context):
    """eval expression

    :return corresponde tensorflow object:
    """
    raise TypeError("Unknown expression type")


@_eval.register(parser.NumberExpression)
def _(number_expression, context):
    """eval given number expression

    :return tensorflow constant:
    """
    return tf.constant(number_expression.number)


@_eval.register(parser.IdentifierExpression)
def _(identifier_expression, context):
    """eval given identifier expression

    :return tensorflow variable:
    """
    if identifier_expression.identifier in context:
        return context[identifier_expression.identifier]
    tf_variable = tf.get_variable(identifier_expression.identifier, dtype=tf.float32, shape=(), initializer=tf.initializers.random_normal())
    context[identifier_expression.identifier] = tf_variable
    return tf_variable


@_eval.register(parser.InfixExpression)
def _(infix_expression, context):
    """eval given infix expression

    :return tensorflow operation:
    """
    operator = infix_expression.operator
    left_exp = _eval(infix_expression.left, context)
    right_exp = _eval(infix_expression.right, context)
    if operator == parser.OperatorType.PLUS:
        return left_exp + right_exp
    elif operator == parser.OperatorType.MINUS:
        return left_exp - right_exp
    elif operator == parser.OperatorType.MULTIPLE:
        return left_exp * right_exp
    elif operator == parser.OperatorType.DIVIDE:
        return left_exp / right_exp
    raise UnexpectOperatorTypeException()
